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
    import {baseurl} from "../constants";
    import {onMount} from "svelte";
    import Error from "./Error.svelte";
    import CircularProgress from '@smui/circular-progress';
    import Select, {Option} from "@smui/select";
    import Button, {Icon, Label} from "@smui/button";
    import Switch from '@smui/switch';
    import FormField from '@smui/form-field';

    let weeks = {};

    // Example model for simple and fast testing of new UI elements:
    // let weeks = {
    //     0: [ // Class with ID 0
    //         [ // Week 1
    //             [ // Hour 0
    //                 {
    //                     ID: 0,
    //                     id: 0,
    //                     Hour: 0,
    //                     DayOfTheWeek: 0,
    //                     SubjectName: "SLJ9a",
    //                 },
    //                 {
    //                     ID: 1,
    //                     id: 1,
    //                     Hour: 0,
    //                     DayOfTheWeek: 3,
    //                     SubjectName: "TJA9a",
    //                 },
    //             ],
    //             [ // Hour 1
    //                 {
    //                     ID: 2,
    //                     id: 2,
    //                     Hour: 1,
    //                     DayOfTheWeek: 0,
    //                     SubjectName: "MAT9a",
    //                 },
    //                 {
    //                     ID: 3,
    //                     id: 3,
    //                     Hour: 1,
    //                     DayOfTheWeek: 0,
    //                     SubjectName: "MAT9b",
    //                 },
    //             ],
    //             [ // Hour 2
    //                 {
    //                     ID: 4,
    //                     id: 4,
    //                     Hour: 2,
    //                     DayOfTheWeek: 3,
    //                     SubjectName: "GEO9b",
    //                 },
    //                 {
    //                     ID: 5,
    //                     id: 5,
    //                     Hour: 2,
    //                     DayOfTheWeek: 2,
    //                     SubjectName: "ZGO9a",
    //                 },
    //             ],
    //             [ // Hour 3
    //
    //             ],
    //             [ // Hour 4
    //
    //             ],
    //             [ // Hour 5
    //
    //             ],
    //             // Hour x
    //             // ...
    //         ],
    //         [],
    //     ]
    // }


    let classes = [];
    let classId = undefined;
    let timetable = [];

    let cutoff = false;

    let cancelPostProcessingBeforeDone = false;

    function parseTimetable() {
        for (let n in timetable) {
            let hour = timetable[n];

            if (hour.Hour >= 10) {
                cutoff = true;
                continue
            }

            hour.id = hour.ID;
            for (let i: number in hour.ClassID) {
                let classId = hour.ClassID[i];
                weeks[classId][hour.Week][hour.Hour].push(hour)
            }
        }
    }

    async function manualPostProcessTimetable() {
        let fd = new FormData();
        fd.append("cancelPostProcessingBeforeDone", cancelPostProcessingBeforeDone.toString());
        fd.append("timetable", JSON.stringify(timetable))
        let response = await fetch(`${baseurl}/proton/timetable/manual_postprocessing`, {credentials: "include", body: fd, method: "POST"})
        let json = await response.json();
        timetable = json.data;
        eraseTimetable();
        parseTimetable();
        console.log(weeks);
    }

    async function assembleTimetable() {
        let response = await fetch(`${baseurl}/proton/assemble/timetable`, {credentials: "include"})
        if (response.status === 500) {
            throw "Ni bilo možno sestaviti urnika. To se zgodi občasno, kadar naš sistem ne izbere naključnih in primernih številk za začetek sestavljanja tega urnika. Prosimo, poskusite znova.";
        }
        let json = await response.json();
        timetable = json.data;
        parseTimetable();
        console.log(weeks);
    }

    function eraseTimetable() {
        for (let n: number in classes) {
            let classN = classes[n]
            weeks[classN.ID] = [ // 2 weeks
                [], // week 1
                [], // week 2
            ];
            for (let i: number = 0; i < 10; i++) {
                weeks[classN.ID][0].push([]);
                weeks[classN.ID][1].push([]);
            }
        }
    }

    async function getClasses() {
        let response = await fetch(`${baseurl}/classes/get`, {credentials: "include"})
        let r = await response.json()
        classes = r["data"]
        eraseTimetable();
        console.log(weeks);
    }

    async function get() {
        await assembleTimetable();
    }

    onMount(async () => {
        window.onunhandledrejection = (e) => {
            window.location = `/napaka?error=${e.reason}`
        }
        await getClasses();
        await parseTimetable();
    })
</script>

{#await get()}
    <div style="display: flex; justify-content: center">
        <CircularProgress style="height: 100px; width: 100px;" indeterminate />
    </div>
    <div style="text-align: center;">
        <span style="font: 200px/1.25 Google Sans,Helvetica Neue,sans-serif;">:-O</span>
        <p/>
        <span style="font: 24px/32px Google Sans,Helvetica Neue,sans-serif;">Proton izvaja svojo čarovnijo. Prosimo počakajte.</span>
        <p/>
    </div>
{:then _}
    {#if cutoff}
        <div tabindex="0" style="background-color: #f57c00; padding: 10px;">
            NEKAJ UR JE BILO ODREZANIH. PROTON V TEM PRIMERU NI PRAVILNO POPRAVIL LUKENJ V PRIMERU PREDMETOV PO POUKU.
            POSKUSITE ZAGNATI SESTAVLJANJE URNIKA ŠE ENKRAT.
            ČE SE TO PONAVLJA, SE PRIPOROČA, DA TO NEMUDOMA
            <a href="https://github.com/MeetPlan/MeetPlanBackend/issues">PRIJAVITE KOT NAPAKO</a>
            RAZVIJALCU PROGRAMSKE OPREME OZ. ŠOLSKEMU ADMINISTRATORJU.
        </div>
    {/if}
    <p/>
    <Select bind:classId variant="outlined">
        <Option value="" on:click={() => classId = undefined} />
        {#each classes as c}
            <Option on:click={async () => classId = c["ID"]} value={c["ID"]}>{c["Name"]}</Option>
        {/each}
    </Select>
    {#if classId !== undefined}
        {#each weeks[classId] as hours, w}
            <h3>{w + 1}. teden</h3>
            <table class="coolTable">
                <tr>
                    <th>URA</th>
                    <th>PONEDELJEK</th>
                    <th>TOREK</th>
                    <th>SREDA</th>
                    <th>ČETRTEK</th>
                    <th>PETEK</th>
                </tr>
                {#each hours as m, i}
                    <tr>
                        <th>{i}.</th>
                        <td>
                            <div style="height: 5px;"/>
                            {#each m as n}
                                {#if n.DayOfTheWeek === 0}
                                    {n.SubjectName}
                                    <br>
                                {/if}
                            {/each}
                        </td>
                        <td>
                            <div style="height: 5px;"/>
                            {#each m as n}
                                {#if n.DayOfTheWeek === 1}
                                    {n.SubjectName}
                                    <br>
                                {/if}
                            {/each}
                        </td>
                        <td>
                            <div style="height: 5px;"/>
                            {#each m as n}
                                {#if n.DayOfTheWeek === 2}
                                    {n.SubjectName}
                                    <br>
                                {/if}
                            {/each}
                        </td>
                        <td>
                            <div style="height: 5px;"/>
                            {#each m as n}
                                {#if n.DayOfTheWeek === 3}
                                    {n.SubjectName}
                                    <br>
                                {/if}
                            {/each}
                        </td>
                        <td>
                            <div style="height: 5px;"/>
                            {#each m as n}
                                {#if n.DayOfTheWeek === 4}
                                    {n.SubjectName}
                                    <br>
                                {/if}
                            {/each}
                        </td>
                    </tr>
                {/each}
            </table>
        {/each}
    {/if}
    <p/>
    <Button on:click={() => {
                    let fd = new FormData();
                    fd.append("timetable", JSON.stringify(timetable));
                    fetch(`${baseurl}/proton/accept/timetable`, {credentials: "include", method: "POST", body: fd})
                }} variant="raised">
        <Icon class="material-icons">check</Icon>
        <Label>Sprejmi urnik in ga pošlji v beto</Label>
    </Button>
    <p/>
    <FormField>
        <Switch bind:checked={cancelPostProcessingBeforeDone} />
        Hitro post procesiranje (boljše za manjše popravke)
    </FormField>
    <p/>
    <Button on:click={async () => await manualPostProcessTimetable()} variant="raised">
        <Icon class="material-icons">replay</Icon>
        <Label>Ponovi post-procesiranje urnika</Label>
    </Button>
    <p/>
{:catch error}
    <Error error={error} />
{/await}
