<script lang="ts">
    import Tooltip, { Wrapper } from '@smui/tooltip';
    import { link } from "svelte-routing";
    import type {Meeting} from "./typescript-definitions/tsdef";
    import isMobile from "is-mobile";

    export let n: Meeting;
    export let lengthOfArray: number;
    export let i: number;

    const mobile: boolean = isMobile();
</script>

<style>
    a { color: white; }

    .triangle {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        border-left: 20px solid transparent;
        right: 0;
    }

    .classroom {
        position: absolute;
        bottom: 6px;
        right: 5px;
        font-size: 10px;
    }

    .test { border-top: 20px solid green; }
    .substitution { border-top: 20px solid red; }
    .notMandatory { border-top: 20px solid blue; }
    .grading { border-top: 20px solid pink; }
    .beta { border-top: 20px solid orange; }

    a:link { text-decoration: none; }

    a:visited { text-decoration: none; }

    a:hover { text-decoration: none; }

    a:active { text-decoration: none; }

    .pos { position: relative; }
</style>

<a use:link href={`/meeting/${n.ID}`}>
    <Wrapper>
        <span tabindex="0" style="background-color: {n.Subject.Color}; padding: 5px; display: flex; width: {Math.round(100/lengthOfArray) - 6}%; display: inline-block; height: 40px; text-align: left;" class="pos">
            <span style="font-size: 12px; font-weight: 700;">{n.MeetingName}</span><br>
            <span style="font-size: 10px;">
                {#each n.TeacherName.split(" ") as t, i}
                    {#if n.TeacherName.split(" ").length === i+1 && !mobile}
                        {t[0].toUpperCase()}{t.substring(1)}
                    {:else}
                        {t[0].toUpperCase()}.
                    {/if}
                {/each}
            </span>
            <div
                    class="triangle {n.IsSubstitution ? 'substitution' : ''} {n.IsGrading ? 'grading' : ''} {n.IsTest ? 'test' : ''} {n.IsBeta ? 'beta' : ''} {!n.IsMandatory ? 'notMandatory' : ''}"
            ></div>
            <span class="classroom">
                {n.Location}
            </span>
        </span>
        <Tooltip unbounded>
            <h1>{n.MeetingName}</h1>
            Predmet: <b>{n.Subject.Name}</b><br>
            Učitelj: <b>{n.TeacherName}</b><br>
            Učitelj predmeta: <b>{n.Subject.TeacherName}</b><br>
            Učilnica: <b>{n.Location}</b><br>
            {#if n.IsSubstitution}
                <b>Srečanje je nadomeščanje</b><br>
            {/if}
            {#if n.IsGrading}
                <b>Srečanje je ocenjevanje</b><br>
                {#if n.IsWrittenAssessment}
                    <b>Srečanje je pisno ocenjevanje</b><br>
                {/if}
            {/if}
            {#if n.IsTest}
                <b>Srečanje je preverjanje znanja</b><br>
            {/if}
            {#if !n.IsMandatory}
                <b>Srečanje ni obvezno</b><br>
            {/if}
            {#if n.IsBeta}
                <b>Srečanje je BETA</b><br>
            {/if}
        </Tooltip>
    </Wrapper>
</a>