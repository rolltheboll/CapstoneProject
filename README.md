**Stay4less**
 
**High-Level Design**

![Architecture](https://github.com/user-attachments/assets/fb2ff4b7-b0ed-4b98-88ed-f1c315764693)


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

