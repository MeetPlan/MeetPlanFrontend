<script lang="ts">
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import {formatDate} from "date-fns";
    import Card from "@smui/card";
    import type {UserJSON} from "../typescript-definitions/tsdef";
    import {Icon} from "@smui/common";
    import {Link} from "svelte-routing";
    import Select, {Option} from "@smui/select";
    import {baseurl, saveBlob} from "../constants";
    import Button from "@smui/button";

    export let users: UserJSON[];
    export let callUpdate: Function;

    const choices = ["unverified", "student", "parent", "teacher", "food organizer", "school psychologist", "principal assistant", "principal"];
    const translationMap: Record<string, string> = {
        "unverified": "Nepreverjen",
        "student": "Učenec",
        "parent": "Starš",
        "teacher": "Učitelj",
        "food organizer": "Organizator prehrane",
        "school psychologist": "Šolski psiholog",
        "principal assistant": "Pomočnik ravnatelja",
        "principal": "Ravnatelj",
    }
</script>

<LayoutGrid>
    {#each users as user, i}
        <Cell span={3}>
            <div style="padding: 5px;">
                <Card variant="outlined" padded>
                    <span class="sameline">
                        <span class="inline"><b>{user.Name} {user.Surname}</b></span>
                        {#if user.IsMissingInfo}
                            <Icon class="inline material-icons" style="float: right; color: yellow; font-size: 25px; font-weight: bold;">warning</Icon>
                        {/if}
                        {#if user.IsLocked}
                            <Icon class="inline material-icons" style="float: right; font-size: 25px; font-weight: bold;">lock</Icon>
                        {/if}
                    </span>
                    <br>
                    {user.Email}
                    <br>
                    <Link to="/user/{user.ID}">Dodatne informacije o uporabniku</Link>
                    <br>
                    <Select bind:value={user.Role} label="Izberite vlogo v sistemu">
                        {#each choices as choice}
                            <Option value={choice} on:click={async () => {
                                let fd = new FormData();
                                fd.append("role", choice);

                                await fetch(`${baseurl}/user/role/update/${user.ID}`, {
                                    credentials: "include",
                                    body: fd,
                                    method: "PATCH"
                                })
                                callUpdate();
                            }}>{translationMap[choice]}</Option>
                        {/each}
                    </Select>
                    <p/>
                    <div class="sameline">
                        <Button on:click={async () => {
                            await fetch(`${baseurl}/user/lock_unlock/${user.ID}`, {credentials: "include", method: "PATCH"});
                            callUpdate();
                        }} variant="{user.IsLocked ? 'raised' : 'outlined'}">
                            <Icon class="material-icons">{#if user.IsLocked}lock_open{:else}lock{/if}</Icon>
                            {#if user.IsLocked}Odkleni uporabnika{:else}Zakleni uporabnika{/if}
                        </Button>
                    </div>
                    <div class="sameline">
                        <Button on:click={async () => {
                            let response = await fetch(`${baseurl}/user/get/password_reset/${user.ID}`, {credentials: "include"})
                            let blob = await response.blob()
                            await saveBlob(blob)
                        }} variant="outlined">
                            <Icon class="material-icons">download</Icon>
                            Ponastavi geslo
                        </Button>
                    </div>
                    <div style="height: 25px">

                    </div>
                    <div class="sameline">
                        <Button on:click={async () => {
                            await fetch(`${baseurl}/user/delete/${user.ID}`, {credentials: "include", method: "DELETE"})
                            callUpdate();
                        }} variant="outlined">
                            <Icon class="material-icons">delete</Icon>
                            Izbriši uporabnika
                        </Button>
                    </div>
                </Card>
            </div>
        </Cell>
    {/each}
</LayoutGrid>