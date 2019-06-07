# automart_adc_by_greenDevNG
Auto Mart is an online marketplace for automobiles of diverse makes, model or body type. With Auto Mart, users can sell their cars or buy from trusted dealership or private sellers. The project is for Andela Developer Challenge for Cycle 45 bootcamp.

The project is divided into two parts. the frontend and the backend

The frontend is basically html and css pages. Powered with javascript. API call are made to the backend and results are returned as json obj. 

The about page contains the documentation for the api and other relevant information about the project. The apiConfig.js contain the API configurations settings and common functions.

The backend is currently hosted on AWS and i research about using HTTPS on AWS. I will be need a domain, use i really cannot use the static IP AWS provides. Heroku just didn't accept my payment details. Their new policy requires i provide a payment card and for some reasons the card wasn't accepted. So am hosting the backend (API) on AWS lighsail. 

Since am using AWS for hosting the backend with is written in Node js (express). I am accessing the static ip from http not https. This mean i cannot use github pages because of https to http limitation. So i will be hosting the frontend on my personal server. The url below

http://
