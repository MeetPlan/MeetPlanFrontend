<script lang="ts">
    import Drawer from "./Drawer.svelte";
    import {AppContent} from "@smui/drawer";
    import {navigate} from "svelte-routing";
    import {baseurl} from "./constants";

    import Textfield from "@smui/textfield";
    import HelperText from '@smui/textfield/helper-text';
    import Select, {Option} from "@smui/select";
    import FormField from '@smui/form-field';
    import Switch from '@smui/switch';
    import Button, {Label} from "@smui/button";

    import jwt_decode, { JwtPayload } from "jwt-decode";

    import IconButton, { Icon } from '@smui/icon-button';

    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';

    let meals = [];
    
    function getMeals() {
        fetch(`${baseurl}/meals/get`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}})
            .then((response) => response.json())
            .then((json) => {
                    meals = json["data"];
                },
            );
    }

    function newMeal() {
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
        fetch(`${baseurl}/meals/new`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST", body: fd})
            .then((response) => response.json())
            .then((json) => {
                    getMeals()
                },
            );
    }

    function order(mealId) {
        fetch(`${baseurl}/order/new/${mealId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "POST"})
            .then((response) => response.json())
            .then((json) => {
                    getMeals();
                },
            );
    }

    function removeOrder(mealId) {
        fetch(`${baseurl}/order/get/${mealId}`, {headers: {"Authorization": "Bearer " + localStorage.getItem("key")}, method: "DELETE"})
            .then((response) => response.json())
            .then((json) => {
                    getMeals();
                },
            );
    }

    let absenceList = [];

    let date = "";
    let mealName = "";
    let mealDescription = "";
    let isVegan = false;
    let isVegetarian = false;
    let isLactoseFree = false;
    let isLimited = false;
    let price = "0.00";
    let limit = 100;

    const token = localStorage.getItem("key");
    if (token === null || token === undefined) {
        navigate("/login");
    }

    const decoded = jwt_decode<JwtPayload>(token);

    getMeals();
</script>

<Drawer active="meals" />
<AppContent class="app-content">
    <main class="main-content">
        {#if decoded.role === "admin"}
            <h1>Dodaj nov meni</h1>
            <Textfield bind:value={date} label="Datum menija" type="date" required on:click={() => date = ""}>
                <Icon class="material-icons" slot="leadingIcon">event</Icon>
                <HelperText slot="helper">Izberite prosim datum menija</HelperText>
            </Textfield>
            <Textfield bind:value={mealName} label="Ime menija" required style="width: 100%;" helperLine$style="width: 100%;">
                <HelperText slot="helper">Izberite poljubno ime menija</HelperText>
            </Textfield>
            <Textfield bind:value={mealDescription} label="Opis jedi. Napišite, kaj je v meniju." textarea style="width: 100%;" helperLine$style="width: 100%;" input$rows={8} />
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
            <Button on:click={() => newMeal()}>
                <Icon class="material-icons">add</Icon>
                <Label>Dodaj</Label>
            </Button>
        {/if}
        {#each meals as day}
            <h1>{day.Date}</h1>
            <Accordion>
                {#each day.Meals as meal, i}
                    <Panel bind:open={absenceList[i]}>
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
                            <IconButton slot="icon" toggle pressed={absenceList[i]}>
                                <Icon class="material-icons" on>expand_less</Icon>
                                <Icon class="material-icons">expand_more</Icon>
                            </IconButton>
                        </Header>
                        <Content>
                            {meal.Meals}
                            <p/>
                            {#if !meal.HasOrdered}
                                <Button on:click={() => order(meal.ID)}>
                                    <Icon class="material-icons">add</Icon>
                                    <Label>Naroči</Label>
                                </Button>
                            {:else}
                                <Button on:click={() => removeOrder(meal.ID)}>
                                    <Icon class="material-icons">remove</Icon>
                                    <Label>Odstrani naročilo</Label>
                                </Button>
                            {/if}
                        </Content>
                    </Panel>
                {/each}
            </Accordion>
        {/each}
        <p/>
    </main>
</AppContent>
