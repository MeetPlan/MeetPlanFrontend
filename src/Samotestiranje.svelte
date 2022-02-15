<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";

    import List, {
        Item,
        Graphic,
        Meta,
        Text,
        PrimaryText,
        SecondaryText,
    } from '@smui/list';

    import {baseurl} from "./constants";

    import IconButton from "@smui/button";

    import Select, {Option} from "@smui/select";

    import SamotestiranjeUcenec from "./Samotestiranje/PogledUcenec.svelte";

    import Tipi from "./Samotestiranje/Tipi.svelte";
    import {onMount} from "svelte";
    import {to_number} from "svelte/internal";

    import { Icon } from '@smui/common';

    import jwt_decode, { JwtPayload } from "jwt-decode";
    import { navigate } from "svelte-routing";

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);

    let options;
    let classes = [];
    let classId = "";

    async function getClasses() {
        let response = await fetch(`${baseurl}/classes/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        const r = await response.json();
        classes = r["data"];
    }

    async function makeRequest(c: number) {
        let response = await fetch(`${baseurl}/class/get/${c}/self_testing`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
        const r = await response.json();
        options = r["data"];
    }

    onMount(async () => {
        if (classId !== "") {
            await makeRequest(to_number(classId))
        } else {
            await getClasses()
        }
    });
</script>

<Drawer active="samotestiranje" />
{#if decoded.role === "teacher" || decoded.role === "admin"}
    <AppContent class="app-content">
        <div
                tabindex="0"
                style="background-color: #FDD835; padding: 10px;"
        >
            <Icon class="material-icons">error</Icon>
            Te funkcije morda ni možno uporabljati v vaši državi zaradi zakonov o varstvu osebnih podatkov.<br>
            Države v katerih te funkcije zagotovo ni možno uporabljati:<br>
            - Slovenija<br>
            (možno je, da obstajajo tudi druge države, katerih nismo omenili tukaj)<br>
        </div>
        <br>
        <main class="main-content">
            <div>
                <Select bind:classId label="Izberite razred">
                    <Option value="" on:click={() => options = undefined}/>
                    {#each classes as c}
                        <Option on:click={async () => {
                            await makeRequest(c["ID"]);
                            classId = c["ID"];
                        }} value={c["ID"]}>{c["Name"]}</Option>
                    {/each}
                </Select>
                {#if options !== undefined}
                    <List
                            twoLine
                            avatarList
                            singleSelection
                    >
                        {#each options as item}
                            <Item>
                                <Graphic
                                        style="background-image: url(https://place-hold.it/40x40?text={item['UserName'].split(' ').map((val) => val.substring(0, 1)).join('')}&fontsize=16);"
                                />
                                <Text>
                                    <PrimaryText>{item["UserName"]}</PrimaryText>
                                    <SecondaryText>{item["IsDone"] ? "Je opravil testiranje" : "Ni opravil testiranja"}</SecondaryText>
                                </Text>
                                <Meta>
                                    <Tipi selected={item["Result"]} userId={item["UserID"]} onSelect={async () => {await makeRequest(item["ClassID"])}} classId="{classId}" />
                                </Meta>
                                <Meta>
                                    {#if item["IsDone"] && item["Result"] !== "SE NE TESTIRA"}
                                        <IconButton class="material-icons" on:click={() => {
                                            fetch(`${baseurl}/user/self_testing/get_results/pdf/${item["ID"]}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
                                                .then((response) => response.blob())
                                                .then((blob) => {
                                                  var _url = window.URL.createObjectURL(blob);
                                                  window.open(_url, "_blank").focus();
                                              }).catch((err) => {
                                                console.log(err);
                                              });
                                        }}>download</IconButton>
                                    {:else}
                                        <div></div>
                                    {/if}
                                </Meta>
                            </Item>

                        {/each}
                    </List>
                {/if}
            </div>
        </main>
    </AppContent>
{:else}
    <SamotestiranjeUcenec />
{/if}