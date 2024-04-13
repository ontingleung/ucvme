import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueVideoPlayer from '@videojs-player/vue'
import './assets/main.css'

const app = createApp(App)

export const job_tags = [
    "No Tag", // default tag
    "Manual",
    "Farming",
    "Bar", 
    "Catering",
    "Web Design",
    "Programming",
    "Website Backend",
    "Website Frontend",
    "Engineering",
    "Painting",
    "Hospitality",
    "Cooking",
    "Babysitting",
    "Construction",
    "Electrician",
    "Plumbing",
    "Landscaping",
    "Roofing",
    "Carpentry",
    "Welding",
    "Masonry",
    "Janitorial",
    "Housekeeping",
    "Security",
    "Retail",
    "Sales",
    "Customer Service",
    "Customer Support",
    "Computer Science",

    "Social Media",
    "Management",
    "Graphic Design",
    "Animation",
    "Video Editing",
    "Photography",
    "Writing",
    "Editing",
    "Proofreading",
    "Translation",
    "Data Entry",
    "Event Planning",
    "Fitness Training",
    "Yoga Instruction",
    "Personal Coaching",
    "Tutoring",
    "Technical",
    "Handy-Man",
    "Home-Care",
    "Barista",
    "Bartending",
    "Waitressing",
    "Dishwashing",
    "Delivery",
    "Forklift",
    "Warehousing",
    "Tailoring",
    "Jewelry",
    "Gardening",
    "Animal Care",
    "Pet Sitting",
    "Dog Walking",
    "Cat Grooming",
    "Digital Marketing",
    "Legal",
    "Content Creation",
    "Other"
]
app.use(router)
app.use(VueVideoPlayer)

app.mount('#app')