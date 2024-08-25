<style>
    .tdtable {
        background-color:white;
        color:black;
        min-height: 30px;
    }

    .tdtable:hover {
        background-color:grey;
        color:black;
        min-height: 30px;
    }

    .yellow {
        background-color:yellow;
        color:black;
        min-height: 30px;
    }

    .yellow:hover {
        background-color:yellowgreen;
        color:black;
        min-height: 30px;
    }

    .coolTable {
        border-spacing: 5px;
        text-align: center;
        width: 100%;
    }

    a:link {
        text-decoration: none;
    }
</style>

<script lang="ts">
    import {
        startOfWeek,
        endOfWeek
    } from "date-fns";
    import IconButton from "@smui/icon-button";
    import {baseurl} from "../constants";
    import isMobile from "is-mobile";
    import MeetingCard from "../MeetingCard.svelte";
    import type {Meeting} from "../typescript-definitions/tsdef";

    export let date: Date = new Date();
    let currentDate = new Date(date);
    export let hour = -1;
    export let dateCallback = (day) => {};

    let start: Date = startOfWeek(currentDate, {weekStartsOn: 1})
    let end: Date = endOfWeek(currentDate, {weekStartsOn: 1})

    const mobile: boolean = isMobile();

    function remakeCalendar() {
        dateCallback(currentDate);
        start = startOfWeek(currentDate, {weekStartsOn: 1})
        end = endOfWeek(currentDate, {weekStartsOn: 1})
        fmtStart = fmtDate(start);
        fmtEnd = fmtDate(end);
    }

    function fmtDate(date: Date): string {
        let dd = date.getDate().toString()
        if (dd.length == 1) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm.length == 1 && (date.getMonth() + 1).toString().length == 1) {
            mm = `0${(date.getMonth() + 1)}`
        } else if ((date.getMonth() + 1).toString().length != 1) {
            mm = (date.getMonth() + 1).toString();
        }
        return `${dd}-${mm}-${date.getFullYear()}`
    }

    let fmtStart: string = fmtDate(start);
    let fmtEnd: string = fmtDate(end);

    export let classId: number;
    export let subjectId: number;
    export let teacherId: number;

    function getTimetable() {
        console.log(fmtStart, fmtEnd)

        console.log(classId, teacherId, subjectId)

        fetch(`${baseurl}/timetable/get?start=${fmtStart}&end=${fmtEnd}&${subjectId === undefined ? (teacherId === undefined ? `classId=${classId}` : `teacherId=${teacherId}`) : `subjectId=${subjectId}`}`, {credentials: "include"})
            .then((r) => r.json())
            .then((r) => {
                mon = r["data"][0]["meetings"];
                tue = r["data"][1]["meetings"];
                wed = r["data"][2]["meetings"];
                thu = r["data"][3]["meetings"];
                fri = r["data"][4]["meetings"];
                //sat = r["data"][5]["meetings"];
                dates = [];
                for (let i in r["data"]) {
                    i = r["data"][i]
                    dates.push(i["date"].substring(0, 5))
                }
                console.log(dates)
            });
    }

    const hours: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let dates: string[] = ["", "", "", "", "", ""]
    let mon: Meeting[][] = [];
    let tue: Meeting[][] = [];
    let wed: Meeting[][] = [];
    let thu: Meeting[][] = [];
    let fri: Meeting[][] = [];
    //let sat: Meeting[][] = [];

    getTimetable();
</script>

<IconButton class="material-icons" on:click={() => {
    currentDate.setDate(currentDate.getDate() - 7);
    remakeCalendar();
    getTimetable();
}}>arrow_back</IconButton>
<IconButton class="material-icons" on:click={() => {
    currentDate.setDate(currentDate.getDate() + 7);
    remakeCalendar();
    getTimetable();
}}>arrow_forward</IconButton>

<table class="coolTable">
    <tr>
        <th>URA</th>
        <th>{mobile ? "PON" : "PONEDELJEK"} {dates[0]}</th>
        <th>{mobile ? "TOR" : "TOREK"} {dates[1]}</th>
        <th>{mobile ? "SRE" : "SREDA"} {dates[2]}</th>
        <th>{mobile ? "ČET" : "ČETRTEK"} {dates[3]}</th>
        <th>{mobile ? "PET" : "PETEK"} {dates[4]}</th>
        <!--<th>{mobile ? "SOB" : "SOBOTA"} {dates[5]}</th>-->
    </tr>
    {#each hours as m, i}
    <tr>
        <th>{i}.</th>
        <td>
            <div class="{hour === i && dates[0] === fmtDate(date) ? 'yellow' : ''} sameline">
                {#each Array(mon[i]) as m}
                    <!--<div style="height: 5px;"/>-->
                    {#if m}
                        {#each m as n, k}<MeetingCard n={n} lengthOfArray={m.length} i={k} />{/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[1] === fmtDate(date) ? 'yellow' : ''} sameline">
                {#each Array(tue[i]) as m}
                    <!--<div style="height: 5px;"/>-->
                    {#if m}
                        {#each m as n, k}<MeetingCard n={n} lengthOfArray={m.length} i={k} />{/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[2] === fmtDate(date) ? 'yellow' : ''} sameline">
                {#each Array(wed[i]) as m}
                    <!--<div style="height: 5px;"/>-->
                    {#if m}
                        {#each m as n, k}<MeetingCard n={n} lengthOfArray={m.length} i={k} />{/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[3] === fmtDate(date) ? 'yellow' : ''} sameline">
                {#each Array(thu[i]) as m}
                    <!--<div style="height: 5px;"/>-->
                    {#if m}
                        {#each m as n, k}<MeetingCard n={n} lengthOfArray={m.length} i={k} />{/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[4] === fmtDate(date) ? 'yellow' : ''} sameline">
                {#each Array(fri[i]) as m}
                    <!--<div style="height: 5px;"/>-->
                    {#if m}
                        {#each m as n, k}<MeetingCard n={n} lengthOfArray={m.length} i={k} />{/each}
                    {/if}
                {/each}
            </div>
        </td>
        <!--<td>
            <div class="{hour === i && dates[5] === fmtDate(date) ? 'yellow' : ''} sameline">
                {#each Array(sat[i]) as m}
                    <div style="height: 5px;"/>
                    {#if m}
                        {#each m as n, k}<MeetingCard n={n} lengthOfArray={m.length} i={k} />{/each}
                    {/if}
                {/each}
            </div>
        </td>-->
    </tr>
    {/each}
</table>