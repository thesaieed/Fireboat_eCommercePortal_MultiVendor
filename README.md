# Fireboat_eCommercePortal
5 Month internship project of Mr. Saieed Shafi and Mr. Danish Ayoub,  8th Semester students of GCET Jammu, under the supervision of Mr. Farhan Rafiq Bhat, CEO Fireboat Studios PVt. Ltd. 


## Client Details
Using React.js on the client side which runs of port 3000. 



## Server Details 
Using Node.js on the server side which runs of port 5000. 



## DATABASE Details 
![DataBase ERD](https://github.com/thesaieed/Fireboat_eCommercePortal_MultiVendor/assets/72975452/90e66611-53c2-418d-a0d8-2485aed7520b) 

1. Create a Database **eCommerce** in PostgresSQl .

<code>CREATE DATABASE "eCommerce"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_India.1252'
    LC_CTYPE = 'English_India.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;</code>
    <br><br><br>
    </code>
2. create a Tables using following SQL 

<code>BEGIN;
CREATE TABLE IF NOT EXISTS public.brands
(
    id integer NOT NULL DEFAULT 'nextval('brands_id_seq'::regclass)',
    brand character varying COLLATE pg_catalog."default" NOT NULL,
    created_at time with time zone DEFAULT 'now()',
    modified_at time with time zone DEFAULT 'now()',
    vendor_id integer,
    CONSTRAINT brands_pkey PRIMARY KEY (id),
    CONSTRAINT unique_brand UNIQUE (brand)
        INCLUDE(brand)
);
CREATE TABLE IF NOT EXISTS public.cart
(
    id integer NOT NULL DEFAULT 'nextval('"Cart_id_seq"'::regclass)',
    user_id integer NOT NULL DEFAULT '0'::numeric,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    CONSTRAINT cart_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.categories
(
    id integer NOT NULL DEFAULT 'nextval('"Categories_id_seq"'::regclass)',
    name character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    vendor_id integer,
    CONSTRAINT categories_pkey PRIMARY KEY (id),
    CONSTRAINT unique_category UNIQUE (name)
);
CREATE TABLE IF NOT EXISTS public.discount
(
    id integer NOT NULL DEFAULT 'nextval('"Discount_id_seq"'::regclass)',
    name character varying COLLATE pg_catalog."default",
    "desc" text COLLATE pg_catalog."default",
    discount_percent real,
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    CONSTRAINT discount_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.newvendorsapproval
(
    id integer NOT NULL DEFAULT 'nextval('"newVendorsApprovalList_id_seq"'::regclass)',
    vendor_id integer NOT NULL,
    CONSTRAINT "newVendorsApprovalList_pkey" PRIMARY KEY (id),
    CONSTRAINT unique_vendor UNIQUE (vendor_id)
        INCLUDE(vendor_id)
);
CREATE TABLE IF NOT EXISTS public.orders
(
    id integer NOT NULL DEFAULT 'nextval('orders_id_seq'::regclass)',
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    user_id integer,
    amount integer,
    transaction_id character varying COLLATE pg_catalog."default",
    payment_status character varying COLLATE pg_catalog."default",
    payment_details_id integer,
    product_id integer,
    quantity integer,
    order_id character varying COLLATE pg_catalog."default",
    vendor_id integer,
    address_id integer,
    order_status character varying COLLATE pg_catalog."default" DEFAULT 'Awaiting Status'::character varying,
    hash character varying COLLATE pg_catalog."default",
    product_info character varying COLLATE pg_catalog."default",
    firstname character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    CONSTRAINT order_items_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.payments
(
    id integer NOT NULL DEFAULT 'nextval('payment_details_id_seq'::regclass)',
    amount real,
    status character varying COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT '2023-07-15 12:41:55.683848'::timestamp without time zone,
    modified_at timestamp without time zone DEFAULT '2023-07-15 12:41:55.683848'::timestamp without time zone,
    transaction_id character varying COLLATE pg_catalog."default",
    product_info character varying COLLATE pg_catalog."default",
    mihpayid character varying COLLATE pg_catalog."default",
    mode character varying COLLATE pg_catalog."default",
    order_id character varying COLLATE pg_catalog."default"
);
CREATE TABLE IF NOT EXISTS public.products
(
    id integer NOT NULL DEFAULT 'nextval('"Products_id_seq"'::regclass)',
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default",
    price real DEFAULT '0'::numeric,
    stock_available integer DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    discount_id integer DEFAULT '-1'::integer,
    category_id integer,
    image character varying[] COLLATE pg_catalog."default",
    category character varying COLLATE pg_catalog."default",
    brand_id integer,
    vendor_id integer,
    avg_rating real DEFAULT 0,
    CONSTRAINT products_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.reviews
(
    id integer NOT NULL DEFAULT 'nextval('reviews_id_seq'::regclass)',
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    rating real NOT NULL,
    review character varying COLLATE pg_catalog."default",
    CONSTRAINT reviews_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.shippingaddress
(
    id integer NOT NULL DEFAULT 'nextval('shippingaddress_id_seq'::regclass)',
    user_id integer,
    full_name character varying(255) COLLATE pg_catalog."default",
    country character varying(100) COLLATE pg_catalog."default",
    phone_number character varying(20) COLLATE pg_catalog."default",
    pincode character varying(10) COLLATE pg_catalog."default",
    house_no_company character varying(100) COLLATE pg_catalog."default",
    area_street_village character varying(255) COLLATE pg_catalog."default",
    landmark character varying(255) COLLATE pg_catalog."default",
    town_city character varying(100) COLLATE pg_catalog."default",
    state character varying(100) COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    CONSTRAINT shippingaddress_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT 'nextval('users_id_seq'::regclass)',
    name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default",
    phone numeric,
    address character varying COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    logged_in_tokens character varying[] COLLATE pg_catalog."default",
    isemailverified boolean NOT NULL DEFAULT 'false',
    isactive boolean DEFAULT 'true',
    recent_searches character varying[] COLLATE pg_catalog."default",
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT unique_email UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS public.vendorappliedcheckouts
(
    id integer NOT NULL DEFAULT 'nextval('vendorappliedcheckouts_id_seq'::regclass)',
    vendor_id integer,
    amount real,
    created_at timestamp without time zone DEFAULT 'now()',
    modified_at timestamp without time zone DEFAULT 'now()',
    status character varying COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    denyreason text COLLATE pg_catalog."default",
    upi_address character varying COLLATE pg_catalog."default",
    transaction_id character varying COLLATE pg_catalog."default",
    order_id character varying COLLATE pg_catalog."default",
    CONSTRAINT vendorappliedcheckouts_pkey PRIMARY KEY (id)
);
CREATE TABLE IF NOT EXISTS public.vendors
(
    id integer NOT NULL DEFAULT 'nextval('vendors_id_seq'::regclass)',
    password character varying COLLATE pg_catalog."default",
    business_name character varying COLLATE pg_catalog."default",
    business_address character varying[] COLLATE pg_catalog."default",
    phone character varying COLLATE pg_catalog."default",
    is_approved boolean,
    is_admin boolean NOT NULL DEFAULT 'false',
    disapproved_reason text COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    isemailverified boolean NOT NULL DEFAULT 'false',
    is_super_admin boolean NOT NULL DEFAULT 'false',
    logged_in_tokens character varying[] COLLATE pg_catalog."default",
    is_under_approval boolean NOT NULL,
    CONSTRAINT vendors_pkey PRIMARY KEY (id),
    CONSTRAINT unique_vendor_email UNIQUE (email)
        INCLUDE(email)
);
ALTER TABLE IF EXISTS public.brands
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id)
    REFERENCES public.vendors (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
ALTER TABLE IF EXISTS public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id)
    REFERENCES public.products (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS fki_product_id
    ON public.cart(product_id);
ALTER TABLE IF EXISTS public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;
CREATE INDEX IF NOT EXISTS fki_user_id
    ON public.cart(user_id);
ALTER TABLE IF EXISTS public.categories
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id)
    REFERENCES public.vendors (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
CREATE INDEX IF NOT EXISTS fki_c
    ON public.categories(vendor_id);
ALTER TABLE IF EXISTS public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id)
    REFERENCES public.vendors (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;
CREATE INDEX IF NOT EXISTS unique_vendor
    ON public.newvendorsapproval(vendor_id);
ALTER TABLE IF EXISTS public.orders
    ADD CONSTRAINT user_id FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE SET NULL
    ON DELETE SET NULL;
ALTER TABLE IF EXISTS public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id)
    REFERENCES public.brands (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;
CREATE INDEX IF NOT EXISTS fki_brand_id
    ON public.products(brand_id);
ALTER TABLE IF EXISTS public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id)
    REFERENCES public.categories (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL;
ALTER TABLE IF EXISTS public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id)
    REFERENCES public.discount (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
CREATE INDEX IF NOT EXISTS fki_discount_id
    ON public.products(discount_id);
ALTER TABLE IF EXISTS public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id)
    REFERENCES public.vendors (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE CASCADE
    NOT VALID;
ALTER TABLE IF EXISTS public.reviews
    ADD CONSTRAINT "productID" FOREIGN KEY (product_id)
    REFERENCES public.products (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
CREATE INDEX IF NOT EXISTS "fki_productID"
    ON public.reviews(product_id);
ALTER TABLE IF EXISTS public.reviews
    ADD CONSTRAINT "userId" FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    NOT VALID;
CREATE INDEX IF NOT EXISTS "fki_userId"
    ON public.reviews(user_id);
ALTER TABLE IF EXISTS public.shippingaddress
    ADD CONSTRAINT shippingaddress_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
END;</code>

<p> NOTE : using postgreSQl Server 15, which runs of Port 5433 </p>

