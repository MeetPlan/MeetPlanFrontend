# MeetPlan
This repository contains the frontend of MeetPlan. It is written using TypeScript and Svelte.

Everything is currently in Slovenian. I am currently working on translations.

## Backstory
So, here came the lockdown. Schools went online, and that caused some serious problems.

I started noticing, that the timetable of (Zoom) meetings for our school was a complete mess.
It would change every single day, sometimes even twice a day.
It was impossible to organize your entire day.
Sometimes, meetings weren't even listed on the timetable.
When you got the timetable for next week, you'd be all happy, because there was only 1 meeting a day, but that was not true.
Fact was, that we got up to 5 meetings a day, which is a pain.

I decided, that it was enough, and I took things into my hands.

I created something, I called [MeetPlan](https://github.com/MeetPlan/MeetPlan).

Overtime, I noticed, it was really complicated and extremly poorly designed.
It contained bugs everywhere.

That's why I came out with this v2, which follows Material design (which means stunning design), is extremely stable and fast, as we use Svelte and Go.

As Covid situation changes everywhere, our government also decided to make mandatory self-testing on Covid every Monday, Wednesday and Friday.

This organisation was (once again) a complete mess on my school.
We are using a simple Google Spreadsheet for inserting results into it.

So, I added even more features, than in v1.

## Deployment
We provide docker images. Have a look at [MeetPlanDocker](https://github.com/MeetPlan/MeetPlanDocker) for docker-compose.

I wish you happy meeting planning.

## Screenshots
### Admin interface:
![image](https://user-images.githubusercontent.com/52399966/152976301-73723ac1-b8d4-42e1-b727-38540aa85204.png)
### Teacher and admin interface:
![image](https://user-images.githubusercontent.com/52399966/152969469-ff6dd531-b405-4f43-a828-d45fe29e69b9.png)
![image](https://user-images.githubusercontent.com/52399966/152971950-4ca62794-f5e9-4bbb-b611-96af322b8d15.png)
![image](https://user-images.githubusercontent.com/52399966/152975749-244604f5-4b3a-4b1e-98ec-25b605abc8ad.png)
### Student interface
![image](https://user-images.githubusercontent.com/52399966/152976053-f79e4121-efee-47d5-9286-5e0ae7a00a70.png)
### Self-testing certificate for student
![image](https://user-images.githubusercontent.com/52399966/152975511-a9e56279-85cb-4a13-8c7e-77c5b4b6f832.png)
