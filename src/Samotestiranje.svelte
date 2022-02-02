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

    import Tipi from "./Samotestiranje/Tipi.svelte";

    let options = [
        {
            name: 'Bruce Willis',
            description: 'Actor',
        },
        {
            name: 'Austin Powers',
            description: 'Fictional Character',
        },
        {
            name: 'Thomas Edison',
            description: 'Inventor',
        },
        {
            name: 'Stephen Hawking',
            description: 'Scientist',
        },
    ];

</script>

<Drawer active="samotestiranje" />
<AppContent class="app-content">
    <main class="main-content">
        <div>
            <List
                    twoLine
                    avatarList
                    singleSelection
            >
                {#each options as item}
                    <Item>
                        <Graphic
                                style="background-image: url(https://place-hold.it/40x40?text={item.name.split(' ').map((val) => val.substring(0, 1)).join('')}&fontsize=16);"
                        />
                        <Text>
                            <PrimaryText>{item.name}</PrimaryText>
                            <SecondaryText>{item.description}</SecondaryText>
                        </Text>
                        <Meta><Tipi/></Meta>
                    </Item>

                {/each}
            </List>
        </div>
    </main>
</AppContent>
