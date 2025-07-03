**Proposal Submission**

**Stay4less**

2.	**Problem Statement:**
   
International students arriving in Canada often struggle to find safe and affordable housing due to a lack of platforms that cater their needs. Common rental sites are too broad, and accommodation companies charge hefty amounts of money to find a place. This project seeks to create a student-focused housing platform to connect students with accessible and reliable housing opportunities
------------------------------------------------------------------------------------------------------------------------------------------------------
3. **Overview of the Application’s Functionality:**
   
The app will allow users to:
•	Create accounts as either students or landlords.

•	Students can search for accommodation by city, institution, price, or housing type (shared, private, homestay, etc.)

•	Landlords can post and manage listings with images, pricing, and descriptions.

•	A built-in messaging system will allow students to directly contact landlords.

•	Students will be able to save listings and leave reviews based on their rental experience.

•	The app will include an admin panel to manage users and verify listings.
------------------------------------------------------------------------------------------------------------------------------------------------------------
4.**Technology Stack:**
   
**Frontend:**

•	React + Vite

•	Tailwind CSS 

•	React Router 

•	Axios 

•	MapBox

**Backend:**

•	Node.js  

•	Express.js

•	JWT (JSON WEB TOKENS) 

•	Bcrypt 

•	MongoDB Atlas

 **Deployment:**
 
•	AWS

•	Cloudinary

**Other tools:**
•	Postman

•	Github
----------------------------------------------------------------------------------------------------------------------------------------
5.	**Features to be Implemented:**
   
Core features:

-User creation and authentication

•	Register/login as student or landlord

-Role-Based Access

•	Students and landlords have different dashboard views and permissions

-Property Listings

•	Landlords can create, edit, and delete their listings

•	Listings will allow images, location, price, and description

-Search & Filtering

•	Students can search by city, institution, price, and housing type
              
Inquiry Submission 

•	Students can contact landlords via inquiry form

-Favorite Listings

•	Students can save listings to view later

-Reviews & Ratings

•	Students can leave reviews after their experience

-Admin Panel

•	Admin can manage users and listings

Stretch Features

•	Live chatting

•	Email notifications

•	O2auth

**New features implemented**:
- Created a message thread between landlords and students so they can exchange messages after an inquiry is sent
- Added a report controller to flag inappropriate listings or scams

-----------------------------------------------------------------------------------------------------------------------------
7.	User Stories:

As a student:
-	As a student, I want to search and filter listings by city, institution, price, and housing type so that I can find accommodation that fits my needs.
-	As a student, I want to create an account so that I can access accommodation listings and save my preferences.
-	As a student, I want to send an inquiry to a landlord so that I can ask questions about a property I’m interested in.
  
As a landlord:
-	As a landlord, I want to create an account so that I can publish and manage my listings.
-	As a landlord, I want to edit or delete my listings to keep the information accurate and up to date.

As an admin:
-	As an admin, I want to view all users and listings so I can manage the platform effectively.
-	As an admin, I want to ban users or listings that violate the platform’s guidelines.








 
**High-Level Design**

![Architecture](https://github.com/user-attachments/assets/50208983-03f2-470f-895d-f56ddb95882a)



For the UI design I will take this as inspiration:
https://dribbble.com/shots/25938849-Apartmanija-hr-Rental-page
------------------------------------------------------------------------------------------------------------

**Database Schema Design**

ERD Diagram:

![erd](https://github.com/user-attachments/assets/29202b93-b392-42b9-a93d-5146ae42857c)
-----------------------------------------------------------------------------------------------------------------
**CRUD operations:**

**Users Collection**

Create:	Register a new account

Read:	Login, get user profile

Update:	Update profile info 

Delete:	Admin deletes a user or user deletes the account

**Listings Collection**

Create:	Landlord creates a new listing

Read:	Students search and view listings

Update:	Landlord edits their listing

Delete:	Landlord deletes a listing or admin removes it


**Inquiries Collection**

Create:	Student sends an inquiry about a listing

Read:	Landlord views inquiries received; student views sent inquiries

Update:	Not needed

Delete:	Admin can delete old messages

**Reviews Collection**

Create:	Student leaves a review on a listing

Read:	Listings display their reviews

Update:	Student edits their review 

Delete:	Student or admin deletes the review 

**Favorites Collection**

Create:	Student saves a listing

Read:	Student views their saved listings

Update:	Not needed

Delete:	Student removes a listing from favorites


-----------------------------------------------------------------------------------------------------------------



**API Contract Submission**
 
**API Contract:**

**Authentication Endpoints**

POST /api/auth/register - Registers a new user 

POST /api/auth/login - Logs in as a user 

**User Endpoints**

GET /api/users/me - The user retrieves their profile

**Listings Endpoints**

POST /api/listings - Landlord creates a listing

GET /api/listings - Students search and filter

GET /api/listings/:id - View single listing

PUT /api/listings/:id - Landlord edits listing

DELETE /api/listings/:id - Landlord or admin deletes listing

**Inquiry Endpoints**

POST /api/inquiries - Student sends inquiry

GET /api/inquiries - View sent/received inquiries

**Favorite Endpoints**

POST /api/favorites - Student saves a listing

GET /api/favorites - Get student's saved listings

DELETE /api/favorites/:listingId - Remove a saved listing

**Review Endpoints**

POST /api/reviews - Student adds a review

GET /api/reviews/:listingId - View the reviews of a listing

PUT /api/reviews/:id - Students edit the review 

DELETE /api/reviews/:id - Students or admin delete the review 

**Admin Endpoints**

GET /api/admin/users - Admin views all users

DELETE /api/admin/users/:id - Admin bans user

GET /api/admin/listings - Admin views all listings

DELETE /api/admin/listings/:id - Admin deletes listing

