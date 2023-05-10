# Fireboat_eCommersePortal
4 Month internship project of Mr. Saieed Shafi and Mr. Danish Ayoub,  8th Semester students of GCET Jammu, under the supervision of Mr. Farhan Rafiq Bhat, CEO Fireboat Studios PVt. Ltd. 


## Client Details
Using React.js on the client side which runs of port 3000. 



## Server Details 
Using Node.js on the client side which runs of port 5000. 



## DATABASE Details 
1. Create a Database **eCommerse** in PostgresSQl .

<code>CREATE DATABASE "eCommerse"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;</code>
    <br><br><br>
2. create a Table 'users' with following details : 

<code>id |  name   |       email       | password |   phone    | isadmin</code>

| Column  | Datatype |
| ------------- | ------------- |
| id | serial  |
| name | text  |
| email | text  |
| password | text  |
| phone | numeric  |
| isadmin | boolean  |

<p>To Create the users table:  </p>
<code>CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT 'nextval('users_id_seq'::regclass)',
    name text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default",
    phone numeric,
    isadmin boolean NOT NULL DEFAULT 'false',
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
)</code>

<p> NOTE : using postgreSQl Server 15, which runs of Port 5433 </p>

