<script lang="ts">
    import {navigate} from "svelte-navigator";
    import {baseurl} from "./constants";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import Button, {Label} from "@smui/button";



    import IconButton, { Icon } from '@smui/icon-button';

    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

    import * as marked from 'marked';
    import Avatar from "svelte-avatar";
    import insane from "insane";
    import Error from "./Widgets/Error.svelte";
    import Cookies from "js-cookie";


    let meals = [];
    
    async function getMeals() {
        let response = await fetch(`${baseurl}/meals/get`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}})
        let json = await response.json();
        meals = json["data"];
        for (let i in meals) {
            absenceList[meals[i].ID] = false;
        }
    }

    function getMealParameters() {
        let fd = new FormData();
        fd.append("date", date)
        fd.append("title", mealName)
        fd.append("description", mealDescription)
        fd.append("isVegan", isVegan.toString())
        if (isVegan) {
            fd.append("isVegetarian", "true")
            fd.append("isLactoseFree", "true")
        } else {
            fd.append("isVegetarian", isVegetarian.toString())
            fd.append("isLactoseFree", isLactoseFree.toString())
        }
        fd.append("isLimited", isLimited.toString())
        fd.append("limit", limit.toString())
        fd.append("price", price.toString())
        return fd;
    }

    function resetMealParams() {
        mealDescription = "";
        date = "";
        mealName = "";
        isVegan = false;
        isVegetarian = false;
        isLimited = false;
        limit = 0;
        isLactoseFree = false;
        price = "0.00";
        mealEditId = undefined;
    }

    async function newMeal() {
        let fd = getMealParameters();
        await fetch(`${baseurl}/meals/new`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST", body: fd});
        await getMeals()
    }

    async function order(mealId) {
        await fetch(`${baseurl}/order/new/${mealId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "POST"});
        await getMeals();
    }

    async function editMeal(mealId) {
        await fetch(`${baseurl}/meal/get/${mealId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH", body: getMealParameters()})
        await getMeals();
        resetMealParams();
    }

    async function deleteMeal(mealId) {
        await fetch(`${baseurl}/meal/get/${mealId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
        await getMeals();
    }

    async function blockOrders(mealId) {
        await fetch(`${baseurl}/order/get/${mealId}/block_unblock`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "PATCH"})
        await getMeals();
    }

    async function removeOrder(mealId) {
        await fetch(`${baseurl}/order/get/${mealId}`, {headers: {"Authorization": "Bearer " + Cookies.get("key")}, method: "DELETE"})
        await getMeals();
    }

    let absenceList: number[boolean] = {};

    let date = "";
    let mealName = "";
    let mealDescription = "";
    let isVegan = false;
    let isVegetarian = false;
    let isLactoseFree = false;
    let isLimited = false;
    let price = "0.00";
    let limit = 100;
    let mealEditId;

    const token = Cookies.get("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }


</script>

{#await getMeals()}
{:then _}
    {#if sessionStorage.getItem("role") === "admin" || sessionStorage.getItem("role") === "principal" || sessionStorage.getItem("role") === "principal assistant" || sessionStorage.getItem("role") === "food organizer"}
        <h1>Dodaj nov meni</h1>
        <Textfield bind:value={date} label="Datum menija" type="date" required on:click={() => date = ""}>
            <Icon class="material-icons" slot="leadingIcon">event</Icon>
            <HelperText slot="helper">Izberite prosim datum menija</HelperText>
        </Textfield>
        <Textfield bind:value={mealName} label="Ime menija" required style="width: 100%;" helperLine$style="width: 100%;">
            <HelperText slot="helper">Izberite poljubno ime menija</HelperText>
        </Textfield>
        <Textfield bind:value={mealDescription} label="Opis jedi. Napišite, kaj je v meniju. Podpira Markdown." textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />
        <br>
        {#if mealDescription !== ""}
            <h2>Predogled:</h2>
            {@html insane(marked.marked(mealDescription))}
        {/if}
        <br>
        <FormField>
            <Switch bind:checked={isVegan} />
            Je vegansko
        </FormField>
        <br>
        {#if !isVegan}
            <FormField>
                <Switch bind:checked={isVegetarian} />
                Je vegetarijansko
            </FormField>
            <br>
            <FormField>
                <Switch bind:checked={isLactoseFree} />
                Je brez laktoze
            </FormField>
            <br>
        {/if}
        <FormField>
            <Switch bind:checked={isLimited} />
            Je količina omejena
        </FormField>
        {#if isLimited}
            <br>
            <Textfield bind:value={limit} label="Omejitev naročil" type="number" />
        {/if}
        <br>
        <Textfield bind:value={price} required style="width: 100%;" helperLine$style="width: 100%;">
            <HelperText slot="helper">Cena</HelperText>
            <svelte:fragment slot="trailingIcon">
                <Icon class="material-icons">euro</Icon>
            </svelte:fragment>
        </Textfield>
        <br>
        {#if mealEditId !== undefined}
            <Button on:click={async () => await editMeal(mealEditId)}>
                <Icon class="material-icons">edit</Icon>
                <Label>Shrani spremembe</Label>
            </Button>
            <Button on:click={() => resetMealParams()}>
                <Icon class="material-icons">delete</Icon>
                <Label>Končaj z urejanjem brez shranjevanja</Label>
            </Button>
        {:else}
            <Button on:click={async () => await newMeal()}>
                <Icon class="material-icons">add</Icon>
                <Label>Dodaj</Label>
            </Button>
        {/if}
    {/if}
    <h2>Pomen ikon:</h2>
    <Icon class="material-icons">block</Icon> - Naročila so blokirana<br>
    <Icon class="material-icons" on>done</Icon> - Naročeno<br>
    <Icon class="material-icons" on>compost</Icon> - Je vegansko<br>
    <Icon class="material-icons" on>no_food</Icon> - Je vegetarijansko<br>
    <Icon class="material-icons" on>format_color_reset</Icon> - Je brez laktoze<br>
    {#each meals as day}
        <h1>{day.Date}</h1>
        <Accordion>
            {#each day.Meals as meal}
                <Panel bind:open={absenceList[meal.ID]}>
                    <Header>
                        {meal.MealTitle}
                        {#if meal.HasOrdered}
                            <Icon class="material-icons" on>done</Icon>
                        {/if}
                        {#if meal.IsVegan}
                            <Icon class="material-icons" on>compost</Icon>
                        {/if}
                        {#if meal.IsVegetarian}
                            <Icon class="material-icons" on>no_food</Icon>
                        {/if}
                        {#if meal.IsLactoseFree}
                            <Icon class="material-icons" on>format_color_reset</Icon>
                        {/if}
                        {#if meal.BlockOrders}
                            <Icon class="material-icons">block</Icon>
                        {/if}
                        <IconButton slot="icon" toggle pressed={absenceList[meal.ID]}>
                            <Icon class="material-icons" on>expand_less</Icon>
                            <Icon class="material-icons">expand_more</Icon>
                        </IconButton>
                    </Header>
                    <Content>
                        {@html insane(marked.marked(meal.Meals))}
                        <p/>
                        Cena: {meal.Price.toFixed(2)}€
                        <p/>
                        {#if !meal.BlockOrders && !meal.IsLimitReached}
                            {#if !meal.HasOrdered}
                                <Button on:click={async () => await order(meal.ID)}>
                                    <Icon class="material-icons">add</Icon>
                                    <Label>Naroči</Label>
                                </Button>
                            {:else}
                                <Button on:click={async () => await removeOrder(meal.ID)}>
                                    <Icon class="material-icons">remove</Icon>
                                    <Label>Odstrani naročilo</Label>
                                </Button>
                            {/if}
                        {:else}
                            {#if meal.IsLimitReached}
                                Prekoračeno je bilo maksimalno število naročil.
                            {:else}
                                Naročila so blokirana. Obrnite se na sistemskega administratorja.
                            {/if}
                            <p/>
                        {/if}
                        {#if sessionStorage.getItem("role") === "admin" || sessionStorage.getItem("role") === "principal" || sessionStorage.getItem("role") === "principal assistant" || sessionStorage.getItem("role") === "food organizer"}
                            <Button on:click={() => {
                                mealDescription = meal.Meals;
                                date = meal.Date;
                                mealName = meal.MealTitle;
                                isVegan = meal.IsVegan;
                                isVegetarian = meal.IsVegetarian;
                                isLimited = meal.IsLimited;
                                limit = meal.OrderLimit;
                                isLactoseFree = meal.IsLactoseFree;
                                price = meal.Price;
                                mealEditId = meal.ID;
                            }}>
                                <Icon class="material-icons">edit</Icon>
                                <Label>Uredi</Label>
                            </Button>
                            <Button on:click={async () => await deleteMeal(meal.ID)}>
                                <Icon class="material-icons">delete</Icon>
                                <Label>Izbriši</Label>
                            </Button>
                            {#if meal.BlockOrders}
                                <Button on:click={async () => await blockOrders(meal.ID)}>
                                    <Icon class="material-icons">done</Icon>
                                    <Label>Dovoli naročila</Label>
                                </Button>
                            {:else}
                                <Button on:click={async () => await blockOrders(meal.ID)}>
                                    <Icon class="material-icons">block</Icon>
                                    <Label>Blokiraj naročila</Label>
                                </Button>
                            {/if}
                            <p/>
                            <h2>Naročila:</h2>
                            Števec naročil: {meal.MealOrders.length}
                            {#each meal.MealOrders as user}
                                <br>
                                <div class="sameline">
                                    <Avatar name={user.Name} style="display: inline-block;"/>
                                    <div style="display: inline-block;">{user.Name}</div>
                                </div>
                            {/each}
                        {/if}
                    </Content>
                </Panel>
            {/each}
        </Accordion>
    {/each}
    <p/>
{:catch err}
    <Error error={err} />
{/await}