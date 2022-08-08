<script lang="ts">
	import {Router, Route} from "svelte-navigator";
	import Drawer from "./Drawer.svelte";
	import {AppContent} from "@smui/drawer";
	import Error from "./Widgets/Error.svelte";
</script>

<div class="drawer-container">
	<Router>
		<Drawer />
		<AppContent class="app-content">
			<main class="main-content">
				<div>
					<Route path="/samotestiranje">
						{#await import('./Samotestiranje.svelte') then Samotestiranje}
							<Samotestiranje.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/login">
						{#await import('./Login.svelte') then Login}
							<Login.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/register">
						{#await import('./register.svelte') then Register}
							<Register.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/users">
						{#await import('./Admin/Users.svelte') then Users}
							<Users.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/new/meeting">
						{#await import('./NewMeeting.svelte') then NewMeeting}
							<NewMeeting.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<!--<Route path="/my/grades" component="{MyGrades}" />-->
					<Route path="/my/class">
						{#await import('./MyClass.svelte') then MyClass}
							<MyClass.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/communication/:id" let:params >
						{#await import('./Communication.svelte') then Communication}
							<Communication.default id="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/user/:id" let:params >
						{#await import('./User.svelte') then User}
							<User.default id="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/class/user/:id" let:params >
						{#await import('./ClassUser.svelte') then ClassUser}
							<ClassUser.default studentId="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/edit/:id" let:params >
						{#await import('./NewMeeting.svelte') then NewMeeting}
							<NewMeeting.default editId="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/meeting/:id/grading" let:params >
						{#await import('./SubjectGrades.svelte') then SubjectGrades}
							<SubjectGrades.default meetingId="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/meeting/:id/absence" let:params >
						{#await import('./AbsenceManagement.svelte') then AbsenceManagement}
							<AbsenceManagement.default meetingId="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/meeting/:id/homework" let:params >
						{#await import('./Homework.svelte') then Homework}
							<Homework.default meetingId="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/meeting/:id" let:params >
						{#await import('./Meeting.svelte') then Meeting}
							<Meeting.default meetingId="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/class/:id" let:params >
						{#await import('./Class.svelte') then Class}
							<Class.default id="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/subject/:id" let:params >
						{#await import('./Subject.svelte') then Subject}
							<Subject.default id="{params.id}" />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/subjects">
						{#await import('./Subjects.svelte') then Subjects}
							<Subjects.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/meals">
						{#await import('./Meals.svelte') then Meals}
							<Meals.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/classes">
						{#await import('./Classes.svelte') then Classes}
							<Classes.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/settings">
						{#await import('./Settings.svelte') then Settings}
							<Settings.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/notifications">
						{#await import('./Notifications.svelte') then Notifications}
							<Notifications.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/documents">
						{#await import('./Documents.svelte') then Documents}
							<Documents.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/settings/user">
						{#await import('./UserSettings.svelte') then UserSettings}
							<UserSettings.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/proton/settings">
						{#await import('./ProtonSettings.svelte') then ProtonSettings}
							<ProtonSettings.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/napaka">
						{#await import('./ErrorPage.svelte') then ErrorPage}
							<ErrorPage.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
					<Route path="/">
						{#await import('./Home.svelte') then Home}
							<Home.default />
						{:catch e}
							<Error err={e} />
						{/await}
					</Route>
				</div>
			</main>
		</AppContent>
	</Router>
</div>
