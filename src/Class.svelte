<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {Item, Text as TextList, Meta, Graphic, PrimaryText, SecondaryText} from "@smui/list";
    import IconButton from "@smui/icon-button";

    import {onMount} from "svelte";

    let myClasses;
    let students;
    let classId = "";

    export let id: number;

    async function getClass() {
        let response = await fetch("http://127.0.0.1:8000/class/get/" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        let r = await response.json();
        students = r["data"];
    }

    function assignToClass(cid: string) {
        fetch("http://127.0.0.1:8000/class/get/" + cid + "/add_user/" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "PATCH"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    function deleteFromClass(cid: string) {
        fetch("http://127.0.0.1:8000/class/get/" + cid + "/remove_user/" + id, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((r) => getClass());
    }

    onMount(async () => {
        await getClass();
    })
</script>

<Drawer active="user" />
<AppContent class="app-content">
    <main class="main-content">
        {#if students !== undefined}
            <h2>Učitelj:</h2>
            <List class="demo-list" twoLine avatarList>
                <Item>
                    <Graphic
                            style="background-image: url(https://place-hold.it/40x40?text={students.TeacherName.split(' ').map((val) => val.substring(0, 1)).join('')}&fontsize=16);"
                    />
                    <TextList>
                        <PrimaryText>{students.TeacherName}</PrimaryText>
                    </TextList>
                </Item>
            </List>
            <h2>Učenci:</h2>
            <List class="demo-list" twoLine avatarList>
                {#each students.Students as item}
                    <Item>
                        <Graphic
                                style="background-image: url(https://place-hold.it/40x40?text={item.Name.split(' ').map((val) => val.substring(0, 1)).join('')}&fontsize=16);"
                        />
                        <TextList>
                            <PrimaryText>{item.Name}</PrimaryText>
                        </TextList>
                        <Meta><IconButton class="material-icons" on:click={() => deleteFromClass(item.ID)} title="Remove from class">delete</IconButton></Meta>
                    </Item>
                {/each}
            </List>
        {/if}
    </main>
</AppContent>
