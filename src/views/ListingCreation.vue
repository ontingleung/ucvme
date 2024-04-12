<template>
  <div class="">
    <h1>This is the job listing creation page</h1>
  </div>
</template>

<style>
{
  job_title             : string,
  job_author        : string,  // The ID of the user who published the job
  working_days   : ["MON", "TUE", "WED", "THURS", "FRI", "SAT", "SUN"],
  job_description : string, // the main description
  job_mini_description : string // what to show on the individual job cards in the job search view
  type                     : ["Once", "MultipleDays", "Recurring"]   // Is this a one-time job, a job that will take multiple days, or a part/full time job?
  deadline             : date, // OPTIONAL: dont show this job to user when the deadline has been passed 
  desired_experience    : number, // OPTIONAL: How many Months experience, 0 will result in leaving this field blank 
  salary                   : float, // expected pay per hour, 0 will result in a "To be Discussed" message instead
  tags                       : string array[] // ["Pub", "Hospitality", "Waitering", "Food", "Lounge Staff", etc... ] Max of 6 tags 
  county                  : string
}
</style>
