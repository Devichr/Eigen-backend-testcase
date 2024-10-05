# This library system is technical test of PT. Eigen Tri Mathema Backend test Case

A backend API to manage a simple library system where members can borrow and return books under specific conditions. The project uses **NestJS** as the backend framework, **Swagger** for API documentation, and implements Domain-Driven Design (DDD) and Unit Testing.

## Requirements

- **NestJS Framework** or **ExpressJS** with TypeScript
- **Swagger** for API documentation
- **SQL/NoSQL Database**
- The project is **open-sourced** on GitHub

- ## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **API Documentation**: Swagger
- **Testing**: Jest

## Extras

- Domain-Driven Design (DDD) Pattern
- Unit Testing with **Jest**

## Features

### Entities

1. **Member**
   - A member can borrow up to 2 books.
   - Members cannot borrow books if they are penalized.

2. **Book**
   - Books can only be borrowed by one member at a time.
   - Books being borrowed are marked as unavailable.

### Use Cases

1. **Borrowing Books**
   - Members can borrow books under the following conditions:
     - A member cannot borrow more than 2 books.
     - A book being borrowed cannot be borrowed by another member.
     - The member is not currently penalized.

2. **Returning Books**
   - Members can return books with the following conditions:
     - The returned book must be one the member borrowed.
     - If the book is returned after more than 7 days, the member will be penalized.
     - Penalized members cannot borrow books for 3 days.

3. **Check Book Availability**
   - Shows all available books and their quantities.
   - Books that are being borrowed are not counted.

4. **Member Check**
   - Displays all existing members.
   - Shows the number of books each member is currently borrowing.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Devichr/Eigen-backend-testcase.git
   cd library-system
