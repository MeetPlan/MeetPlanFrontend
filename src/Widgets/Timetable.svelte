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
        border-spacing: 10px;
        text-align: center;
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
    import { Link } from "svelte-routing";
    import {baseurl} from "../constants";

    export let date: Date = new Date();
    let currentDate = new Date(date);
    export let hour = -1;

    let start: Date = startOfWeek(currentDate, {weekStartsOn: 1})
    let end: Date = endOfWeek(currentDate, {weekStartsOn: 1})

    function remakeCalendar() {
        start = startOfWeek(currentDate, {weekStartsOn: 1})
        end = endOfWeek(currentDate, {weekStartsOn: 1})
        fmtStart = fmtDate(start);
        fmtEnd = fmtDate(end);
    }

    function fmtDate(date: Date): string {
        let dd = date.getDate().toString()
        if (dd < 10) {
            dd = `0${dd}`
        }
        let mm = date.getMonth().toString();
        if (mm < 10) {
            mm = `0${(date.getMonth() + 1).toString()}`
        }
        return `${dd}-${mm}-${date.getFullYear()}`
    }

    let fmtStart: string = fmtDate(start);
    let fmtEnd: string = fmtDate(end);

    export let classId: number;
    export let subjectId: number;

    function getTimetable() {
        console.log(fmtStart, fmtEnd)
        fetch(`${baseurl}/timetable/get?start=${fmtStart}&end=${fmtEnd}&${subjectId === undefined ? `classId=${classId}` : `subjectId=${subjectId}`}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((r) => r.json())
            .then((r) => {
                mon = r["data"][0]["meetings"];
                tue = r["data"][1]["meetings"];
                wed = r["data"][2]["meetings"];
                thu = r["data"][3]["meetings"];
                fri = r["data"][4]["meetings"];
                sat = r["data"][5]["meetings"];
                dates = [];
                for (let i in r["data"]) {
                    i = r["data"][i]
                    dates.push(i["date"])
                }
                console.log(dates)
            });
    }
    const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    let dates = ["", "", "", "", "", ""]
    let mon = [];
    let tue = [];
    let wed = [];
    let thu = [];
    let fri = [];
    let sat = [];

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
        <th>PONEDELJEK {dates[0]}</th>
        <th>TOREK {dates[1]}</th>
        <th>SREDA {dates[2]}</th>
        <th>ČETRTEK {dates[3]}</th>
        <th>PETEK {dates[4]}</th>
        <th>SOBOTA {dates[5]}</th>
    </tr>
    {#each hours as m, i}
    <tr>
        <th>{i}.</th>
        <td>
            <div class="{hour === i && dates[0] === fmtDate(date) ? 'yellow' : 'tdtable'}">
                {#each Array(mon[i]) as m}
                    {#if m}
                        {#each m as n}
                            <Link to="/meeting/{n.ID}">{n.MeetingName}</Link>
                            <br>
                        {/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[1] === fmtDate(date) ? 'yellow' : 'tdtable'}">
                {#each Array(tue[i]) as m}
                    {#if m}
                        {#each m as n}
                            <Link to="/meeting/{n.ID}">{n.MeetingName}</Link>
                            <br>
                        {/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[2] === fmtDate(date) ? 'yellow' : 'tdtable'}">
                {#each Array(wed[i]) as m}
                    {#if m}
                        {#each m as n}
                            <Link to="/meeting/{n.ID}">{n.MeetingName}</Link>
                            <br>
                        {/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[3] === fmtDate(date) ? 'yellow' : 'tdtable'}">
                {#each Array(thu[i]) as m}
                    {#if m}
                        {#each m as n}
                            <Link to="/meeting/{n.ID}">{n.MeetingName}</Link>
                            <br>
                        {/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[4] === fmtDate(date) ? 'yellow' : 'tdtable'}">
                {#each Array(fri[i]) as m}
                    {#if m}
                        {#each m as n}
                            <Link to="/meeting/{n.ID}">{n.MeetingName}</Link>
                            <br>
                        {/each}
                    {/if}
                {/each}
            </div>
        </td>
        <td>
            <div class="{hour === i && dates[5] === fmtDate(date) ? 'yellow' : 'tdtable'}">
                {#each Array(sat[i]) as m}
                    {#if m}
                        {#each m as n}
                            <Link to="/meeting/{n.ID}">{n.MeetingName}</Link>
                            <br>
                        {/each}
                    {/if}
                {/each}
            </div>
        </td>
    </tr>
    {/each}
</table>