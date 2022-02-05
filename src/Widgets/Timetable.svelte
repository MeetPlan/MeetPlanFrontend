<style>

    table.coolTable td {
        background-color:white;
        color:black;
        height: 30px;
        width: 16%;
    }

    table.coolTable td:hover {
        background-color:grey;
        color:black;
        height: 30px;
        width: 16%;
    }

    .coolTable {
        border-spacing: 10px;
        text-align: center;
    }

    a:link {
        text-decoration: none;
    }

    .main {
        width: 100%;
        height: 100%;
    }

</style>

<script>
    let mon = ["MAT", "", "", "", "", "", ""];
    let tue = ["MAT", "", "", "", "", "", ""];
    let wed = ["MAT", "", "", "", "", "", ""];
    let thu = ["MAT", "", "", "", "", "", ""];
    let fri = ["MAT", "", "", "", "", "", ""];
    let sat = ["MAT", "", "", "", "", "", ""];
</script>

<table class="coolTable">
    <tr>
        <th>URA</th>
        <th>PONEDELJEK</th>
        <th>TOREK</th>
        <th>SREDA</th>
        <th>ČETRTEK</th>
        <th>PETEK</th>
        <th>SOBOTA</th>
    </tr>
    {#each mon as m, i}
    <tr>
        <th>{i}.</th>
        <td>
            {mon[i]}
        </td>
        <td>
            {tue[i]}
        </td>
        <td>
            {wed[i]}
        </td>
        <td>
            {thu[i]}
        </td>
        <td>
            {fri[i]}
        </td>
        <td>
            {sat[i]}
        </td>
    </tr>
    {/each}
</table>