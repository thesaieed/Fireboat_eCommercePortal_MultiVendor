PGDMP     5    #                {         	   eCommerce    15.2    15.2 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    107148 	   eCommerce    DATABASE     ~   CREATE DATABASE "eCommerce" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE "eCommerce";
                postgres    false            �            1255    107149     main_update_modified_at_column()    FUNCTION     �   CREATE FUNCTION public.main_update_modified_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW; 
END;
$$;
 7   DROP FUNCTION public.main_update_modified_at_column();
       public          postgres    false            �            1255    107150    update_avg_rating()    FUNCTION     �  CREATE FUNCTION public.update_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_product_id INTEGER;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        v_product_id := NEW.product_id;
    ELSIF TG_OP = 'DELETE' THEN
        v_product_id := OLD.product_id;
    END IF;

    UPDATE products SET avg_rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE product_id = v_product_id), 0) WHERE id = v_product_id;
    RETURN NEW;
END;
$$;
 *   DROP FUNCTION public.update_avg_rating();
       public          postgres    false            �            1255    107151    update_product_category()    FUNCTION     V  CREATE FUNCTION public.update_product_category() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.category_id IS NOT NULL THEN
    SELECT name INTO NEW.category
    FROM categories
    WHERE id = NEW.category_id;
  ELSE
    NEW.category := NULL; -- Set category to NULL if category_id is NULL
  END IF;
  
  RETURN NEW;
END;
$$;
 0   DROP FUNCTION public.update_product_category();
       public          postgres    false            �            1255    107152    update_product_category_after()    FUNCTION     �  CREATE FUNCTION public.update_product_category_after() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND TG_TABLE_NAME = 'categories' THEN
    UPDATE products
    SET category = NEW.name
    WHERE category_id = NEW.id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products
    SET category = NULL
    WHERE category_id = OLD.id;
  END IF;

  RETURN NEW;
END;
$$;
 6   DROP FUNCTION public.update_product_category_after();
       public          postgres    false            �            1259    107153    cart    TABLE       CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer DEFAULT '0'::numeric NOT NULL,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    107159    Cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Cart_id_seq";
       public          postgres    false    214            �           0    0    Cart_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public."Cart_id_seq" OWNED BY public.cart.id;
          public          postgres    false    215            �            1259    107160 
   categories    TABLE     �   CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    vendor_id integer
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    107167    Categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Categories_id_seq";
       public          postgres    false    216            �           0    0    Categories_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Categories_id_seq" OWNED BY public.categories.id;
          public          postgres    false    217            �            1259    107168    discount    TABLE     �   CREATE TABLE public.discount (
    id integer NOT NULL,
    name character varying,
    "desc" text,
    discount_percent real,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.discount;
       public         heap    postgres    false            �            1259    107175    Discount_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Discount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Discount_id_seq";
       public          postgres    false    218            �           0    0    Discount_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Discount_id_seq" OWNED BY public.discount.id;
          public          postgres    false    219            �            1259    107196    products    TABLE       CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    price real DEFAULT '0'::numeric,
    stock_available integer DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    discount_id integer DEFAULT '-1'::integer,
    category_id integer,
    image character varying[],
    category character varying,
    brand_id integer,
    vendor_id integer,
    avg_rating real DEFAULT 0
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    107207    Products_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Products_id_seq";
       public          postgres    false    220            �           0    0    Products_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Products_id_seq" OWNED BY public.products.id;
          public          postgres    false    221            �            1259    107208    brands    TABLE     �   CREATE TABLE public.brands (
    id integer NOT NULL,
    brand character varying NOT NULL,
    created_at time with time zone DEFAULT now(),
    modified_at time with time zone DEFAULT now(),
    vendor_id integer
);
    DROP TABLE public.brands;
       public         heap    postgres    false            �            1259    107215    brands_id_seq    SEQUENCE     �   CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.brands_id_seq;
       public          postgres    false    222            �           0    0    brands_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;
          public          postgres    false    223            �            1259    107216    newvendorsapproval    TABLE     d   CREATE TABLE public.newvendorsapproval (
    id integer NOT NULL,
    vendor_id integer NOT NULL
);
 &   DROP TABLE public.newvendorsapproval;
       public         heap    postgres    false            �            1259    107219    newVendorsApprovalList_id_seq    SEQUENCE     �   CREATE SEQUENCE public."newVendorsApprovalList_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."newVendorsApprovalList_id_seq";
       public          postgres    false    224            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public."newVendorsApprovalList_id_seq" OWNED BY public.newvendorsapproval.id;
          public          postgres    false    225            �            1259    107413    orders    TABLE     �  CREATE TABLE public.orders (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    user_id integer,
    amount real,
    transaction_id character varying,
    payment_status character varying,
    payment_details_id integer,
    product_id integer,
    quantity integer,
    order_id character varying,
    vendor_id integer,
    address_id integer,
    order_status character varying DEFAULT 'Awaiting Status'::character varying,
    hash character varying,
    product_info character varying,
    firstname character varying,
    email character varying
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    107412    orders_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.orders_id_seq;
       public          postgres    false    235            �           0    0    orders_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;
          public          postgres    false    234            �            1259    107430    payments    TABLE     �  CREATE TABLE public.payments (
    id integer NOT NULL,
    amount real,
    status character varying,
    created_at timestamp without time zone DEFAULT '2023-07-15 12:41:55.683848'::timestamp without time zone,
    modified_at timestamp without time zone DEFAULT '2023-07-15 12:41:55.683848'::timestamp without time zone,
    transaction_id character varying,
    product_info character varying,
    mihpayid character varying,
    mode character varying,
    order_id character varying
);
    DROP TABLE public.payments;
       public         heap    postgres    false            �            1259    107429    payment_details_id_seq    SEQUENCE     �   CREATE SEQUENCE public.payment_details_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.payment_details_id_seq;
       public          postgres    false    237            �           0    0    payment_details_id_seq    SEQUENCE OWNED BY     J   ALTER SEQUENCE public.payment_details_id_seq OWNED BY public.payments.id;
          public          postgres    false    236            �            1259    107220    reviews    TABLE     �   CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    rating real NOT NULL,
    review character varying
);
    DROP TABLE public.reviews;
       public         heap    postgres    false            �            1259    107225    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public          postgres    false    226            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public          postgres    false    227            �            1259    107226    shippingaddress    TABLE     *  CREATE TABLE public.shippingaddress (
    id integer NOT NULL,
    user_id integer,
    full_name character varying(255),
    country character varying(100),
    phone_number character varying(20),
    pincode character varying(10),
    house_no_company character varying(100),
    area_street_village character varying(255),
    landmark character varying(255),
    town_city character varying(100),
    state character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public.shippingaddress;
       public         heap    postgres    false            �            1259    107233    shippingaddress_id_seq    SEQUENCE     �   CREATE SEQUENCE public.shippingaddress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.shippingaddress_id_seq;
       public          postgres    false    228            �           0    0    shippingaddress_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.shippingaddress_id_seq OWNED BY public.shippingaddress.id;
          public          postgres    false    229            �            1259    107234    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password text,
    phone numeric,
    address character varying,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    logged_in_tokens character varying[],
    isemailverified boolean DEFAULT false NOT NULL,
    isactive boolean DEFAULT true,
    recent_searches character varying[]
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    107242    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    230            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    231            �            1259    107243    vendors    TABLE       CREATE TABLE public.vendors (
    id integer NOT NULL,
    password character varying,
    business_name character varying,
    business_address character varying[],
    phone character varying,
    is_approved boolean,
    is_admin boolean DEFAULT false NOT NULL,
    disapproved_reason text,
    email character varying NOT NULL,
    isemailverified boolean DEFAULT false NOT NULL,
    is_super_admin boolean DEFAULT false NOT NULL,
    logged_in_tokens character varying[],
    is_under_approval boolean NOT NULL
);
    DROP TABLE public.vendors;
       public         heap    postgres    false            �            1259    107251    vendors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.vendors_id_seq;
       public          postgres    false    232            �           0    0    vendors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;
          public          postgres    false    233            �           2604    107252 	   brands id    DEFAULT     f   ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);
 8   ALTER TABLE public.brands ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    107253    cart id    DEFAULT     d   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    107254    categories id    DEFAULT     p   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    107255    discount id    DEFAULT     l   ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public."Discount_id_seq"'::regclass);
 :   ALTER TABLE public.discount ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    107256    newvendorsapproval id    DEFAULT     �   ALTER TABLE ONLY public.newvendorsapproval ALTER COLUMN id SET DEFAULT nextval('public."newVendorsApprovalList_id_seq"'::regclass);
 D   ALTER TABLE public.newvendorsapproval ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    107416 	   orders id    DEFAULT     f   ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);
 8   ALTER TABLE public.orders ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    235    235            �           2604    107433    payments id    DEFAULT     q   ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payment_details_id_seq'::regclass);
 :   ALTER TABLE public.payments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    236    237    237            �           2604    107260    products id    DEFAULT     l   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    107261 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    107262    shippingaddress id    DEFAULT     x   ALTER TABLE ONLY public.shippingaddress ALTER COLUMN id SET DEFAULT nextval('public.shippingaddress_id_seq'::regclass);
 A   ALTER TABLE public.shippingaddress ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228            �           2604    107263    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    230            �           2604    107264 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232            �          0    107208    brands 
   TABLE DATA           O   COPY public.brands (id, brand, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    222   ܤ       �          0    107153    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   �       �          0    107160 
   categories 
   TABLE DATA           R   COPY public.categories (id, name, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    216   �       �          0    107168    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   ]�       �          0    107216    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    224   �       �          0    107413    orders 
   TABLE DATA           �   COPY public.orders (id, created_at, modified_at, user_id, amount, transaction_id, payment_status, payment_details_id, product_id, quantity, order_id, vendor_id, address_id, order_status, hash, product_info, firstname, email) FROM stdin;
    public          postgres    false    235   �       �          0    107430    payments 
   TABLE DATA           �   COPY public.payments (id, amount, status, created_at, modified_at, transaction_id, product_info, mihpayid, mode, order_id) FROM stdin;
    public          postgres    false    237   ��       �          0    107196    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id, avg_rating) FROM stdin;
    public          postgres    false    220   ��       �          0    107220    reviews 
   TABLE DATA           J   COPY public.reviews (id, product_id, user_id, rating, review) FROM stdin;
    public          postgres    false    226   ��       �          0    107226    shippingaddress 
   TABLE DATA           �   COPY public.shippingaddress (id, user_id, full_name, country, phone_number, pincode, house_no_company, area_street_village, landmark, town_city, state, created_at, modified_at) FROM stdin;
    public          postgres    false    228   r      �          0    107234    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified, isactive, recent_searches) FROM stdin;
    public          postgres    false    230   �      �          0    107243    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    232   �      �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 243, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 119, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Products_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Products_id_seq"', 115, true);
          public          postgres    false    221            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 35, true);
          public          postgres    false    223            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."newVendorsApprovalList_id_seq"', 23, true);
          public          postgres    false    225            �           0    0    orders_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.orders_id_seq', 214, true);
          public          postgres    false    234            �           0    0    payment_details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.payment_details_id_seq', 46, true);
          public          postgres    false    236            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 93, true);
          public          postgres    false    227            �           0    0    shippingaddress_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.shippingaddress_id_seq', 4, true);
          public          postgres    false    229            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 131, true);
          public          postgres    false    231            �           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 33, true);
          public          postgres    false    233            �           2606    107267    brands brands_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
       public            postgres    false    222            �           2606    107269    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    214            �           2606    107271    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    216            �           2606    107273    discount discount_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.discount DROP CONSTRAINT discount_pkey;
       public            postgres    false    218            �           2606    107275 .   newvendorsapproval newVendorsApprovalList_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "newVendorsApprovalList_pkey" PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "newVendorsApprovalList_pkey";
       public            postgres    false    224            �           2606    107422    orders order_items_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
 A   ALTER TABLE ONLY public.orders DROP CONSTRAINT order_items_pkey;
       public            postgres    false    235            �           2606    107283    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    220            �           2606    107285    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public            postgres    false    226            �           2606    107287 $   shippingaddress shippingaddress_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.shippingaddress
    ADD CONSTRAINT shippingaddress_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.shippingaddress DROP CONSTRAINT shippingaddress_pkey;
       public            postgres    false    228            �           2606    107289    brands unique_brand 
   CONSTRAINT     _   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT unique_brand UNIQUE (brand) INCLUDE (brand);
 =   ALTER TABLE ONLY public.brands DROP CONSTRAINT unique_brand;
       public            postgres    false    222            �           2606    107291    categories unique_category 
   CONSTRAINT     U   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_category UNIQUE (name);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT unique_category;
       public            postgres    false    216            �           2606    107293    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public            postgres    false    230            �           2606    107295     newvendorsapproval unique_vendor 
   CONSTRAINT     t   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT unique_vendor UNIQUE (vendor_id) INCLUDE (vendor_id);
 J   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT unique_vendor;
       public            postgres    false    224            �           2606    107297    vendors unique_vendor_email 
   CONSTRAINT     g   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT unique_vendor_email UNIQUE (email) INCLUDE (email);
 E   ALTER TABLE ONLY public.vendors DROP CONSTRAINT unique_vendor_email;
       public            postgres    false    232            �           2606    107299    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    230            �           2606    107301    vendors vendors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.vendors DROP CONSTRAINT vendors_pkey;
       public            postgres    false    232            �           1259    107302    fki_brand_id    INDEX     E   CREATE INDEX fki_brand_id ON public.products USING btree (brand_id);
     DROP INDEX public.fki_brand_id;
       public            postgres    false    220            �           1259    107303    fki_c    INDEX     A   CREATE INDEX fki_c ON public.categories USING btree (vendor_id);
    DROP INDEX public.fki_c;
       public            postgres    false    216            �           1259    107304    fki_category_id    INDEX     B   CREATE INDEX fki_category_id ON public.products USING btree (id);
 #   DROP INDEX public.fki_category_id;
       public            postgres    false    220            �           1259    107305    fki_d    INDEX     8   CREATE INDEX fki_d ON public.products USING btree (id);
    DROP INDEX public.fki_d;
       public            postgres    false    220            �           1259    107306    fki_discount_id    INDEX     K   CREATE INDEX fki_discount_id ON public.products USING btree (discount_id);
 #   DROP INDEX public.fki_discount_id;
       public            postgres    false    220            �           1259    107309    fki_productID    INDEX     I   CREATE INDEX "fki_productID" ON public.reviews USING btree (product_id);
 #   DROP INDEX public."fki_productID";
       public            postgres    false    226            �           1259    107310    fki_product_id    INDEX     E   CREATE INDEX fki_product_id ON public.cart USING btree (product_id);
 "   DROP INDEX public.fki_product_id;
       public            postgres    false    214            �           1259    107311 
   fki_userId    INDEX     C   CREATE INDEX "fki_userId" ON public.reviews USING btree (user_id);
     DROP INDEX public."fki_userId";
       public            postgres    false    226            �           1259    107312    fki_user_id    INDEX     ?   CREATE INDEX fki_user_id ON public.cart USING btree (user_id);
    DROP INDEX public.fki_user_id;
       public            postgres    false    214            �           1259    107313    fki_vendorID    INDEX     R   CREATE INDEX "fki_vendorID" ON public.newvendorsapproval USING btree (vendor_id);
 "   DROP INDEX public."fki_vendorID";
       public            postgres    false    224                       2620    107314 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    216    240                       2620    107315 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    220    220    239                       2620    107316 !   reviews update_avg_rating_trigger    TRIGGER     �   CREATE TRIGGER update_avg_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();
 :   DROP TRIGGER update_avg_rating_trigger ON public.reviews;
       public          postgres    false    241    226                        2620    107317    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    238    214                       2620    107318    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    238    216                       2620    107319    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    238    218            	           2620    107428    orders update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 2   DROP TRIGGER update_modified_at ON public.orders;
       public          postgres    false    235    238            
           2620    107446    payments update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.payments;
       public          postgres    false    237    238                       2620    107323    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    238    220                       2620    107324    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    230    238                       2620    107325     brands update_modified_at_column    TRIGGER     �   CREATE TRIGGER update_modified_at_column BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at_column ON public.brands;
       public          postgres    false    222    238            �           2606    107326    products brand_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT brand_id;
       public          postgres    false    3291    220    222            �           2606    107331    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    3278    216    220            �           2606    107336    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    3283    218    220            �           2606    107356    reviews productID    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "productID" FOREIGN KEY (product_id) REFERENCES public.products(id) NOT VALID;
 =   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "productID";
       public          postgres    false    220    3289    226            �           2606    107366    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    220    214    3289            �           2606    107371 ,   shippingaddress shippingaddress_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shippingaddress
    ADD CONSTRAINT shippingaddress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 V   ALTER TABLE ONLY public.shippingaddress DROP CONSTRAINT shippingaddress_user_id_fkey;
       public          postgres    false    3308    230    228            �           2606    107376    reviews userId    FK CONSTRAINT     y   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "userId" FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 :   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "userId";
       public          postgres    false    226    3308    230            �           2606    107386    cart user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    214    230    3308            �           2606    107423    orders user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE SET NULL ON DELETE SET NULL;
 8   ALTER TABLE ONLY public.orders DROP CONSTRAINT user_id;
       public          postgres    false    3308    230    235            �           2606    107391    newvendorsapproval vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "vendorID";
       public          postgres    false    3312    224    232            �           2606    107396    products vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.products DROP CONSTRAINT "vendorID";
       public          postgres    false    232    3312    220            �           2606    107401    categories vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ?   ALTER TABLE ONLY public.categories DROP CONSTRAINT "vendorID";
       public          postgres    false    3312    232    216            �           2606    107406    brands vendorID    FK CONSTRAINT     ~   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ;   ALTER TABLE ONLY public.brands DROP CONSTRAINT "vendorID";
       public          postgres    false    222    232    3312            �   (  x���KO�0���_�;��k{�����C���-�	JS$��8��8U�r������f��h82���B��T4�H��{P�P�Hۢ��)S���95��ӦKu1�МȰ,��yU����+�GV�[�F]Jt��R���?vR����VM�d"g�JK��hȷ��@�Ed:[��.�]��8BMhܸ�&x.7M�V��{|�wD�H�3zDuB+��_��	s���OԘ�)wM[�6��m�_���|p�hTnf���?j~���c�uU1��]�S�IL0�D��y�W)�����      �   �   x�}��q�0D�bn�,�kI�u�bK�w�?h�G8�E�o��B.+2v�47 u���A�^�RnI|S%қ ���l�_��syPEB�Aj�t-�/�.�!�f'��4 ���}a.��Eb"�@���tM�݁vm7&E�<�Ɩ3Jr�����W�&~�MW�$\�:{�B��%�rZZ� ����~�K�� 5`7����ɬ� ��p�<a��ԃ��]R���nAf���1�/�Ō�      �   /  x���Mj�0���)|���H#�@���t㤦51ء�d�:MJB������7�v|���qҠ�	�dU�W�#���FJ��j�;5*5��}Zl\�&��E+�3d��y��iƾ[:)��LlUg���"�B0$����� |B)�H^A�y�a�z>����~=����u��IĪנ�@�������:gIRz�@B��+C��ò��R!9���eȧH�1y%(Nh^*�<���0�N�e������=iƨ�~���!T�����#͌����ap�`]�rOʌW[U�7?��k      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �   �  x����n�@�����b�����U�PJ��&U��6�-�C���;6�ІH[!	4�q�dJT'ҝ�i|�%9�7�6��\И �'@���լ>����<?(%('�u�U%�V	БԽ�����i�*���U�ZW��j����b�5��dB����F&hQb�/ �0����tT��ۢ�!e��fǣ�࣢��8��D^L�_Ų�k��2/��|{`��E����tT����N�tR��Ӵ�$�l��b�dh�t H��5������Y�
o��xtD�섄V������9@�����k	IL�5���z�0��Mo�~|��ڡ�۪�|�{<�����j5.��Q\�ö(J%� ZjP��b��������v��R���C�����{�}1�<�~�EůH�l��:���7��X�٬�:h���_���B(-l��lЭ.?mH�<|�I	�!@%�j�ؠhM1�p�^5A�&�ǒ`��C��jH�g�i�N�k꽀��(�+3[�\��܀�	�#��QLA�It��GX�e]c]�G����ra���%J��9�����ǈA�O�ƴ�[�Ɣ��+��S� o�Wq(���:��}B Uc��Wbl��l��gv�<�Wj��b�1�r��Z�?��
      �     x����r�8����K�pw`&3��7�F1��-�pz��]��T�ˑtt� �|�͂����P�@��R���?�$���B�*�a'��D\*��K��yzs_N���ӡ�(Eb+J��=��7�6\�Cw�E}dAF��Л�q8�YyL��c_�F�ˑ\�0H���8�7��e�vP��Āk��_o�a���"pO���B��G�S��|d��01��@�}t_��N��P�_��~��f���z�HkG!h���f����������z/��C�&�ڑ�M��|�t��!(V����w�8��� Ak��T��dM"�J<�n ��u8Y�D��� !k���;�YPDQ�89�C���}=a/���֐{�D#*�E�q��6vq�r�x�� b�GA�=�����>�\%�lu�=�!��g�� �7U�U�E��_^��"\%���v&e��poVd�U���V���"CQ�+��6���!1]�� q�����^��G�i ��V4�/�N�����bb�����߇�G���@8'�%9m#o/�s|� ��:����hLjW�X�!��W�#��xAL�}g�y�Z��ϝ�<?�9���?�����`��z)m���c��y���zC-7�e!q11��zd[`Uj��f}�e�&-������M"Lg51���r{R��Y+�p��f��֑�D�l�Y��구����(��$�ȹ���.�=��1��~i�/Y����8�P}�P����`�h���*���l�V�{T�{��kyNú�����M�:l�RN�r�`�i���v���%�!RI�d�t:}����y?;�� ��t<�וJ4���9��c7Է��(	ыb2��*v��,�dhz]t1ފAg�y�Q��%cb��u9�;�~�μ��L���j��p��@����n�;��Zx�L^
�!�&[�t�V'^�]��`�Ub?�F�[��ģV��:H��ڦq��,�\�&�~N��[�o�C��TC���ZC��3��51 ��4�둷򧑁(�+�xCf�ա2�f 2���n����,�����pDu#�����Z�s���H
���n�<jf��B�gD$)*@Y��6�s���*���o�D�F��ǹ�0��~t��c޲�t�� �Q#�,|�����VH�dr�^ao�yL3
}�7�I��7��Q��=�3W74�!�(J�1�Ʀ:��oA�QM�r���4���[�����/�l7ß�K����19�����2�7r���Q=Ɣ��S���ˎ��4�B�W�P�?,�g��r�� �p�gI?��e>5
���kR���'�e/K�~���&���
�N�}Z��V�<&�*��\z�bk��狡P!Lv��l}d(�x�(&��SN%w^y��\
�:H�q�+7g�Y�"�)&zo1�1q�[���[0))�Ni-�=���2޳&��1�+�}�Y�OO�$�9������{3�w�Ի:~���' �o#,�:      �      x����r#G�zM=EN���Z�Q�3������$�ݭ���P kX���@�q������7�j�����(3`?���������flO�$��ß�������$	�#u-�q�fQ�Q�"͂e���rv�.��>��u���YӃy�&�j�����$�6�(X���I��Bݦi��T����!̀�k��E���2��B�!-�$��E4��`o�%=<���W�E4�qJ.1O9�B���X}HW���i�0L�-�ﾍ�����~�^f�<��� ��̦�l�L�i��A�e��f� �����_�j��Փ���o��SQB+��"��#�7TH/����\y��ZGጶ�A2��ʣO�Z�ӊ���Y�"�e�pV��Wi^�s��<���1�2'警飚�4�4+�;���A�c�1xү5 ����u���o5Kc������Q�A���8|��i�%Z&�}���`Iï��PE�
�<��x�S9�?�I5T��3��|��4���_s���O��G	�iK�ժ���!��EE�,��Y��/d���ea�O���H��:d@���e�a�����>��,\E�J]=��su��r{GH�XvyRf���.�	���ʢu^�kM Bѯ+� 5ݨ; �=�T&���w�rL�h��2[��� �1��5��ӫ����׆�Y��l�YDt��L���y�	�ҚN*������"�_�鯹z��;Es��8Z��f��[���Jh��!0��
l���f ѻ W�֠�L��Ji�u��IЩ��*)WS� �<��%;��\��-��E�ѱ.� ��¢h�i��_���x��� �ìvfz��;Nh�A�/���5���'�z�f���`���5ׄDAD�|��fl�e�˴kv�;LKlA L4��G(pe�if4ι �'LC���A�3Ƕ2�%B^j��+:�91&F��8��Zbai���gvO$��4%|���C������w�(/G�!���Ĉ
x@�#��� Vě0#P�C�sU�����rM�y �U�D��OEmGqѤ_ry. W��Y5�}�s�S�8�=�Lӹ�D�J�	L���=-Wk�}����E��O��r��CZ�����<�X��'�"���7�8f~�)Z�P�"��l�%_�=�(�ӌ�Y0���y���ׂ�yڜ�͜0�ƚΆv��8 a^8c�����:Ȋ�#G'�𢡄���7�L#�C�-X쫜�,gq���h�N��^�r��K�(���}�z�Y������W�$O��0 {�B�OǑ�G�vB��L1É��>�f�9a��!b��Ը��52���Z#-	�W[���𑰏�����#�WCMV)HN`sꂄiYSw!M��_�Ȑd5*��9($J�0��C]U�\��4Z.���.H4��f�)/�!��bp��V�|0��M5jI�gyT�D�4���
_�*�i��Lya�f�3P��k�����-'9(+�ɱ~>�pA�@���sT�M���҄xD��"Q �˱8���#��>�ܝ( �J��%^����@\��MT��M��(cF$�*%�f��R9MjGm��7Ѣ0��Y�)>�I,g�@E��!AXb.��O��<�v���b�#!��R�ЂVn�`�<�L��Wa��V2=�+͖͟Z�l���ND���jI|#��B�s!#/2:�y���B�;����8��(��o��4ʊ�y���N��&1� |M��;���hd��lK93�:#���B���T)��&^�(㖺	g�@�xL\�T�C��&ŝ0�`J�S�+(��ﾝf�y�݁�F�ށ��;�����<����I�����s?5��=<��/H����D�����=����z����������ɹ�vj�y�|�Ȳ�:4�����98�:S�Ģ��^�Y�G�ՌV�m���X1i��Z�M㹑°cp��X���oS1"�x1����r�X�D��:�" �*��s��H\���Fh$Q�,Ŝ��u�iA~Y�TH����s�������P������B��i�G� طƧ7a��/ye��.�PY�����Qr��ܡ�}�3�SR\���٘�W$p��fӹ��<l+�7�T�4`��{K��^ʊ4Xwϊ�D%ȃ�X���+Y�#�o�qb��;�!��to��K�1ߌ����8�?� ���=�����o1�暎���CH��w��v��6��C������{�ö�j�:�~��١���'�!�6{^��j�co��\Sax~�b�iO�.&�G��^[]�rk1�؄"�r�����0\�u�ܞ�uJ�Q���f$�O��ģ�4�k�mIm�=;�1�"1:ګ,ZF�!i�Du�9�:��;dV�}�ٴ��~��zݞ��� ��x�ag��{?]^>��t��!��
t���w��z�F	�\K�v�&%��X���1�zA
%vK��?;z���Eh�ӘX?�MN��n��,m�s�Ms������A��m�z�^�M0k2I蝴։�݁ �`t�>�fEa���7�n��6�~Iv��#uM������i(�h��6�G�/���#�V?hPz�@��<���6��)����(��Z�YJ ^�s��yJ���������s��\Xp��5 笊y����nh��w�S�L��s��m;�)c���@��� �	ge�']As㡗�8�u��0}9_��Eҳ���O�Y�.z�̷BV�2G�#���Y�|$=b3ծ~GL��ķ�C<�ku��5�Ex���8D$7�Nw@bz3���7���Y1�ۥ_���d9�Gd�/BVJ	��]�o����3衬HD���,ۏ	�(�Ŭ��~��f}������!x�|��<
�l���73�3A�L}�}R�����ӳ��^9���~ ;4��,,�{�x��q;;��7#�,	�/�W�ɾ�,������Gƞ�۠l	`�d6�H�֚�̔�\Y��0v�d�{�j�1h�PT2_��zS�){Yj��DDM��q����J?�qZ�����C��j���d���'�"4&}E��\A����� ���8C�IR�(U^��N?�p�<�K�al���Gi����2�M�Dag�a�+ O�ߘU�8���	���J@�aam0�Zh84:�g�$޸���ƘǼg�L�*	�Q�J� �1�pM�W8'Ne���ٗ "g������Z�'��e�I<�8�������d�ü7Gh��Ǒ�5[w�ԂM����9�~�L��lU'��Z�舷����I\�x���|�T����A���M��+�BQ?�4+bC|yF��7�S��h,�Z�Ln�	\VT�Aoȼ�Lҟ]�u^�|��`�V�z�C��a�l5�S��Y[�I���Ng�@��n�O%���{$WFe{6����Y%�{V��gP#�3��AW[�}Qj�����z�4�E��#b��`�o}�rm�
ewwX_�_����ƞi���}��q�+_l�]{��[�q��G`3� ���K���x�	�[ ��������çz;{�~'����W�=�zp`ch]p�,��U�]7�"բ`���B^/�ɐ���8��H�#�b}I�����O�u�H9!�g�2 W�g+��j�S��1R[F�������N����d���H����#i�M�����c����R����Dq:���,Ai�2. uIP� �Ǥ_�YJ��<W=rE5gnsI²y ����o�g`�\�M������t��|�Lslf`ט���ba^����쳯_� �qJ}��W�8u8�8�G[�5�+�j`Ny���	�.+�g�xL��~�YH0���ǔ�,؍�k}"w[p\�mx3�8ES�ֽ����-�!a^���Z��&�v���į��ɚǊ�^K��xs�\Y#d���8��d:S�������{!DY̲�0���N��@�~�å��\1�wYZ.�p���[ƋNj&��q]���ķ����/����Z��{�#�6�-�2V��hcE{��pn�s�8M�jA�    �g�凿m|�yK$�%�³?y�S�n�n��:���G�v�;�M?��><u~��g���t��bt�4�WW3�hHD�&Mu��z������ =�"`��ձe��FO�łC��hVDt�m�Q���)�H��}9M7r2�(���c)oݒ\�ܶ5�)��v�v��X��$���A���,���P�vд��>�����n��.`�����D�$�9]��a\=��6��a��� L��Gi�h�ܛuߙ�xL6ٴZ�3Ą�g%���%��F��.@m ���b��Ql�U��*�� )�-H��`{�AR��yaSh�́��m9do{�V����Ҏ�78���^�<�s��zdJ�z~�������������`f�cPT�w��Ԩ�MxG��Ս�`[C����㫕�8H���9B��C��J�fA�,�3��u(g�3X}�N;��!�bF�ZG �'a� \���≶HH�Q��^w�IGXi>ݨu���5���xIb.D�X�q�i�'%Iv1ӻ0#sd��]ڮ��$�*�@P�mP+M9��9X�"��jcr\U����&z|�2.U"�sކ��À��k��2�b��In��6��$�d�ӭ�01��`���㵥Ur P��lw7�3��	�*��>}� j������^���9+�����|���0��јb�|�WX������C͵h8�3��>n�,,YֺC�ԕ�4�����^��sK�i���Z��u�����#������~��dW�G�^�C�o6������8�r�8��Ә�<dd�*/�D0Y_�F:�KkMBQps ��6�~"���	�O$]I�� ��k˞��`�Vq��D�ЇPy��������E��`��ڤ8��Ո�b�Ih^,�I��_�-$���/���&F�(�U8�,n���)m�q;�g *+V0�r7.~g��
�8C��q6QM��� ����2v/hqM�'0�U{d���8PP���au-RV��w�������L8D�Jb�P���t"�93�$�Vz�vj�D��kKgILb�%�t�jP��dc:ּ�i����������axo�̀6�=Z}��
2��T��+�'�����2�U	r�8�yXub�:�iQ�(�R���o�1W�P��tb���,h��`��T�u,�Y�(d�VD���^��َZEYƉS�ljM�*��x]���2�E��S��R��Y��@ׂ6�i��r-��a��x�{�5,�
�����eP �a]��4�=Æ�8�͙�Y��Ĥ�U��]r�:ೢ�.e&b�����Q���'����JJ�|_�n�j�wA܋�W�<񸳀c'��D$�B�:�}ڶ M��f�#�:2ۺ5����n�5괻��������k����»|� ��n����ӱ�~����Xq���<ԏ�]�C��8� �� E�A%��^��Z}� ��A:|�C�V�i�ubC�h@�\,�JM�p"����N�K�z����tX��`e՛6;��h��͏�v���cUA:�mx$�`���3V��Ҧ6�vǱ�j�[҇򸜁�ّ� ��1k�\:),;QF��:�l��N6��ӳ:K���|�Y΢�4�Z~������2<8�9ߞ�?U�[u1�=�9�O�r#�|�G;tb�,ܨ����n�v��t�z���:#H�{6���Γ���G/�Q#��b��y�p�3�0W������Ӈ��_����C˅�:!R�9k����`P���a{������G��v����Q�������=�%�t���J�Ţ��1�����A�8<���"�=��n2V�@4U�MF��;:��'���p�5Mn��P��5�1/e�\��Oٟf�����J��|�y�	��rv��%#W)�9%��B,]gjq4��Sm�~����2��&�@ Yl$�(�]��]J���|;�Ău�Qռ6������Gu����D+eWק7D5'�+D�#e�Fĕքe4�?�?pD,���A���X��Gf�]<�$��Q�ru	�P�t�,-�Y��J��E��M�Uȩ��y�p���Z��X���K��JgvsC��j�Č{��������ງ��jw��Sy~���{>e��͞�۟��'�m���~��{�.��8h��m���\��u�:jRNa�r�#g�U$дȎ�ۄ�K�^d���(bBC�]������5l��ЃSN!��E��,W�8�<�|t)�S�8����E�������4U_}�7$�p�H�{g���'�����jo���>�ƴ��Kz⻫$�躘\�8T��m������-"�Y��Y`��#�]sHz
C��l�Y0ka��9�� BS|��Y�|:;��!	��h�����>l�u�;9{f>�o�O�EG�>>N�Ϸ��̹!Ǉ��:�&G�=1�K.%"�"�D�*�D} �:�//�ϯ���<:���m������wE[S׬���=���j��s� Ms$�va]�h~d�J�h��b6���۲��=�A�^��5Iw�p��\�ٜl�!e�(�`��N�CaU���#Y
ld!`(4�kT4K�5E��>�p�]�����g������<<�{���+t�[��������+���90o�N ���	����f���$�ڐ�\�J�`f�D�!�X �~c�
ooo��s��Ț��������?��}�x�GW����ϥ�ut^��1)�d���x����N�:��D��!a��:D�H�ǎ�J��P�IВhFȞ�9�M~F�t,tX��G5ju��	��T�>U���%�>�Yv��Hy���Ґ��a�Q('����ٍ�]6��F<xw��Nd�Cd�ݣD@oo]q�΄�"�5��a���n:L��-oDs����F���g�����H8p��7F��~��2xHH����!PQo 9�:����z����gmq�$�'���,��v���cN癀�!�t)�	���:�Y4�<W&軔�g�PGY!�`���U�<��y��GY�0ot�;)H�î�����ײD�IA"�}�����W�~�I��"����%aF"Q2M-%[�\�?��/�'���sO�x�r]�d!�.�c�
`�r������)El �����$��e},V1"�
D{�"Z<X\��:w�j��9��_/K7.���������U6��U�t�5�e�N�б3Ic�;ۇ88��^��1¡��Q�������?|?y���8�7WWG㣏��k�t���4A8&�m?���Syv�U��Aw�Ѡ���ӯ�8-
]h��̪�%��`A,���/����Hm�`�gK6.a���K���r���� N?H�#/��*-�����6iR<��j=��DV�}pZ^�vu�=�*���*L��J6*���R��:4�ЀnPP�H��>T.o�R��3::��[�;��Bqߘʿ�0^���~V�<QRl
8��8�s�`��^��Y���$9�	��7����m!���o��-�1<�����kj%�W��A{�B(�M�ޕ�j�2��H�>F��e� �=2Afۢ�A��l'�I�y��$
n��~�7h;�����a��tau|�B��{��<���&��F2%ç-)D����k�h$� �[���r�38��(�%���u��^���4sv��?zL�D�c��p:|���,��M뢩ǘZ����@�p�]闖-�����^�����o�AV���g7���g@�0��8UFs��a���T9Ft3����m�n��2#�4�]D���'H��> �΃��΢_�����K��3�}o���!E�!��oj�|���7��$fO�{�.���`ִ�Gb�$MyX՚Ϣ�`H����X=i�%�Q���2�Ct�`f���r�����`����5D�1�ѹ�/=���#KXi{���L���J�M&���"'N��$�5&3�X�9|���=gTm����_����C��"�v�����#A��^���=�� $��^��6���!��}ڏ�:�3�^C-%���uq����F�ׄv�Mj    �&AP��"II�����mk��+�����������|<�������x:�i�7��7����ӓ��1�F���Z¬�Pc�T�ZvKsb�-�_�a�v�"�If�(ĩߤ���$�$#TĬ$���X�F���C.H�-�c=w�̈́2d H�ܠ��4�'g|��]0�����'}zE*)@@I7"�սe���.������C�q�}}��7	�,����c�8F^�V,-N����$���T�MQ��a8�j\�U�sK���PI_�*?�@W����HPZ�=��9YX|nW�'�?F�,����L>o^ӹT��>S��̦Ed�*��P20��D�|��	��QF�%�>R��'��hƎHn��ep� +�q�y�z��Mk��t�ݗ�4_Ò���XwHj�p��F5�de��d\�Gj�3�IxJF}��J��|�v�K� V�I�����]���l�1��t��R;�]���I��~C��?ym)6�u���i_����SZ��z`1®3�����=2����>J.��e$�]���+��'�w�zߝߞ����������L�A�ɿ4\�}J:����G؊d�<B:-#*���d س0i�ȕ�h��B}�+�t�58��n6&м����T�����[�#ˍr�)�����8�A�ɦ'�v�������}���6jN�E`_E�m^P}̱*1��� �6�`ᶼG�"&�r"Er}�!c羚o�.NO��us:>��n��;��ٝKʐl_�DD,�`�Ǥ�F�%�0)܃eC�++�]+Ҕ��ؾ8Q�m�wg���S^�����ջ���x}:QW�-�l�󊓧�4�^c�������r����Ź4"��{�i�"� o�D�!�Y7�� U!	88�݊���E��w��t�Ir���m#� a�i�"���2Mn��m�P����u��������i�L8�G�*��r�ʌ�kt>�օt��L�'ñm
��e6��:A��ZJ� �@F>�}�g���T$=6��v�E�֊��I="`v�o���[��蠻ݹ�o��d�u=W �F�Ѩ��Y��z| ڽa�?j��wd~z�?�@0!Tƾ�'��c�9�H�N�����:K���-�gq(�g��zP,z���E�|uq��F4�%bY� rrv�.��O'ߟ]��˫�ӣ���U���^�S��)WK���KDc3��ܪ��C��.�Ab�X=��	��W����rVQ�}��a.2B
����Q�iI�X`���h���u8ywü���������s|~5ywsz(~w�E��-�n�<��uk��ؖfpu@��vl2���3���⬅<z�L�qt_��s>	��6#�f�]��kG��j�`"q%IҬ�����[�û����G�=�$�%���vӛ���v���e��#mQ��w��op*�{�$���.��i�E��O%̮_s�����Q��T���e�t+ٷp���ݏ�
��7�.�ʟ;�W�E���}�΂�H �����m'�4�=���`ʱvN<�4<��r�2�6{�R�-�а �<���o�X�T��7�l(���G�`���_�3�ѽ��Ǘ+�	8Mh}��9b,�Σ%	�Sx��^ơ�!��)<���1ś�+6X���+�/P5W�-?�����t�c,��ְ������k����<o,�zH?�z͡�vq2�ش������B��-��I
���r�YfC(��� �}�޳nk�����~����Zך�5��V����??�0&��m)4L`�>}Yk���e�G\��d�l	��'�&;f�Kl&�y��`��Eo�æ�{v��~q�̋{^E�@�a�y��q�]$�/�|��x*uQy���T��C��#�=��7�g�.��6$!�!$��n��WӾ��d[s�7N���b!v���B��A$lA,���,��L�!���$�VY�D��$��kZ����u���6u�.O�O'���S��w�F�ܔ��M׌����5b�Y��%H�W��L%�ԉ�܇���'��tr�>�ݾ=t�u%�]\��DЪ=6��5��ب�jUj-�`Es��~|�ds��aU.���m�;]۩�P�`[B��`$҇7��s)�(~g)��JA}�6ɐat�^%V$�Z_2��.��ߝ Q���j,�%�p����-�k�vE|����a>��}G)��3�o����ڃ�(�����d(>��N�o��)�Z��������Qw>��T�r{x$/��z�ڳ������2��ͽys���˳�7�����ճ7����?�g������[6p��>N�H����J�w��{��nZt�rn�03�IOk�ǂ\�d�m�;ѯ��ӥ>�^�q;ڼ4��=�.l���uƦ�P ���K�롉q�KY`Z�j� w��C�[qK��պq���ǖZݞ�.�r{���9]�j�Z�����;�BR��+ �۰Q��]P�Δ8�F7M�w��'J��;2����xc�p��p;��6t�tN�,Z���Z���֋|��iE�uVUݖ��˱���^`r�5�C�(��f\��҉x��L ;T�@���R\Wu��s)ej�`mKv�'oل�!��������m�`���[z�k�/=�r��7�%�H�p"H���]�W��vr�-��5��%K����	�Ab�n��o~]_ǩMcDdJT�X��҅\'p�]��-U��pذ�`��i�fl�#��ۙ��dm���Q�U�+ҏK�W�����(�qe<�̍�Gl�a�����$�D�s"���9-��r<�Iq6̦a�t��[�@�Ź���I���mٮ���ܨ�J�Cf��I��p2��6[���S�,F�,A�4��??�+ۍ�l�n�
'H�Vx��TU,W�1�t;�8�.��T��Ǻ{wq<UwB�d3$|�aZ�ȁ�h����5��ج��D4�Y�N'� :y?D᣻��']��T���!mjiW����cq��9t�^���o��xh9�wH�s���!�����.�g�n�zݎ��4'3���;�$v�6��2�ۢTm{�_�����V�ۭ|����2_��ȿ�MB����j��ĵ�o	�,��/�֜l���x�?<c)�H�f�yY�.S��p	����?�n�G�s��[���F4��㷆���7�\�G�������<wޏ�?S���M�;7D�����$��n�M���'���J�g%��ݰd�p�[�fjUUn��D��0'�F>5�1�6_Jw4�E>a˭��F����^��������^6ם�����ῼ`��Pe��K��P� �|����s+6D��R�g�vJN_kʤ6���s�Iwc󑂑��M8hA��μ��Y`:���X��E�ʩX��q�����TFc�#�޽�� 5�4W���Riɝ"QH"[�k�u�>z���¦��4��8�N4�D��Q�-�x�Bk��hجZí�;&�6���������aX�RoqS��t��V�z�:�2����צd/)$4Ť�q�<k�t.�ZN猍��8P�]qגe}���<4���	��3�Ex�N��9���#��;؍`�� �]�K�dx��V(�Gچ2=���O�����ք�i��ѡ��n��*�F�h�Â�����_�R�8�����}�Jf�։�r�;��ޢW�t�����BU�j��J`�R���S��y��k���	Za�;�`
�:���
 v�S�xn�7��vF��8����3��#���x���;�?�q>�2J]53�^��8�8�}�?�xU���4�'���w�׋v�;����p��NNHu�5"̵غ!���Z��&S�7^&؈��[�+��������O��?���nN����_���M�p{
���vRY��6� !�>�8���a��Aވ
'��Xڪ�E4�|Yt8�U�=�C3Ma��f�F�E�+�:ωL��!��8����t*�M!�;t`#�tN΅uV����H^�ҥ[gIÖ�u���lE�%)�9;����i��ޜ]�L�T�7���A^T�^
㢁�)\%�hW���H��\��/B�h�    ��f����{2��$�M>1�1yw�z||��]��~8={�����O:�S��d�遖:�ߜ���O�����\ijiH�8� S�[�����LC�ކ,����oi-M1<�"T�8y-��3���LR��Ʉ��@MH�k�c��r�=��a|%}�P�Q��z�����F�����0>G���,Ӑ�%����1a��)C���R��\=��Jn4�3y�Q�#ܜ�������s������s�F��Pe��"�md�)=kM�G�7D2rJ��v9e�VÝ��AI�JV�~j�HY+?�f�C�7�cS�Яr�Gx���@UƯo	��j|C���p���p��5��$�rh.f/�=�)?�?����*�Ȧ&���h�U�Yz�"M[�TRs���%�l1�P�����E��� ���4���Y�!��	���i��T�;B{���,�r-k�������a�4d@#q�Z����`���?�^�@�Ԉ%��@�U�9�B�"B��0�NN�����Ma�_��װ���\��]+���Po�*�iU.���G逥-kZ���#7��Nا�
,'�M�ʵW5N�z��,���tҚ�_$���� �m��v���?�仙b����f���y_����z���HCj��u�O�E,5�D=I����hY.Ja`Y�ͧ�����}�$���'��F��`O&X�5���m��L0��.�z����X|> E�`�����������0K��~��!�
�w�s�__#��=7hP����N<>7AK��՛���۳[ơ�w��Cy���_{ɒi%��8��"t��3ԎZ�����m"&���*��+�z輥j�Y�I%qĩ�ӌ��t������W��?\]�"=���ꅑ��Ƌ��T��(�bW��>�˴=W%.!ഉ3�Trņh���7U��C4Cϙ��cB;&'�[�N���S�Z�oOl��9=U�7����!j�ٷ��JI���O8fM��t�gqj��f�ܧ�j��	�-iF+�VZ�@�8 �'�גc���ɄP�b�d�W9��4�	����|m��W6r�1��!]!e�z��w��9�_����| ��Zc?��h �ݛǽ�`�j�k�7�U���s��͛`C�$0�Z&ldk�jr�v��7��O;�D�S\_���R�'pO܁]� :�1�I@h�&}$6�P�<wB�B$1D��C ����Gr��q'�/o��N������ި�������ao��:��gZ��^�Y���?�/N�Ϸ<����p� �*��8^�S\*���M����Z'�����>��E�֊��w$��2�ĥlǷs���oSܨI�v�=�Z53m�ٖ�B��͙׌YZ���:���V����4Y�QC����}�H���@�nQI�5��]O�8O>6o�����K;���sc�lb8�j6��~�͑��|�NW��66 ||�}��ώo��]����
���Z<��Y����4�����EMϬE|�5+%|���D\T�ź�.����Ԙ�~2�#գ��go.'�@��k���?Ņu����������8~�$��ۛ_���v���=�>��N�
X�L7��@�D��&pr�5�d��vԪòdT��on,䐎$(����7����9_Uj���D�b���i�R�G����	�P�p�K7a����`7���0�!�����gx���+��ͥa�h���䪦�u�^�����������V��m��g<u݁��G��~>~�$��Y����L�u݃�`�p���$n�D�(hxڰ�{���/�QHq�����I��j��nm�����{й>\�NI�snh�'w���k�1|ܞ)�I_:�l�q������A!��&�ka{�'��D�V�F�����^*d������q�<��E��Ҍ�iC&�ȗ����il0O	[|EY����p|�!�q�b[��Y)c���6�`���;�0!}���m_r�p���K�z�Z��)%Wk���C����M
�M>�Wlg~1[u��K��$wm�!��۩��5򯯯�.�A���ӛ��l����d��q7�"�(���B��}gR��Ѕ
�d��֝��p5��`�h� bw_�͇�łF��L���sBl��&�R�<<F���o/�ί�|l�����ӛ����SA^,<	��f���Lzv���$[$}�*�)4�k�<��^�$u�
�;V���I��n�`��S��@��b!v��� b�Z#�/��V�į��!s���vIߵN`Jt
n����;��I����\ܬ�f�s�Q��ۄO*��+��R4�qn�7p[D��ʁG�'�Y��Kt�]�7y{v}�:A�fH�ߞM^�s�S�n��]"��;���p=uΗ�����V'�E��s��LL������B�=��c7YuyK�
�[i`�ǟ�yA�|�hIt>��f��Ud 1��-��8�cxFƵ�-,��{2^��Nㄻ8��C�u�Ԯ�#\���L(DR1���)�cG��Y����Xؑ�^���]�R������z?w?�2{��΢�����'��S֩Dm�pU:��s}��<�3Yvr��i%����>��ܲU$��ŧ��2u��0��5����%��"z
�R��ES��o�p����|������� |>CNӯMu�o�s=Gy��%�L����0�a�(,�8Ȟ�pT�<���nq��k���H_<P���r��/k���k�U�"�1����|���:�},�J�S��S53����(~���:8x��I�\[NƏ�����ؑ	�\��>�~�����a�C�.��\ك%��=��7��q�g��F��旱�0��{#-s�8�/ÆN�֙�����5�>/c���tz���JZ� "��\3gx���Ft�E�Ĝ��Jv�&���G�.!ӧ�!�2#�gda�#�j��g� ���+UB���p}�Y�ĉ|K�����p��
�����aU�(�à,"��a[��o�[�(A�B�҆k�Ei�P6J}`8.��߄[i�hd���z����� t2R��s��S�丗��b�^3�����%�ޤ�Yn#6���uBc��
o�c�@\���¿&�{��nW�w�뷼Qo���&��m�!�<�\;�A��u�(T|�|(~�}�k���_x����g?^Ǩ��M�#u�Ru�9IR]��" "X���D$�H�P��N�T��K��)��җi�n<+�j�V��9�<�H�s�ɕ�x�	�ʵ׈����3K,��I�rO�,�N>�Z�̫g����>H�U����9����6�7W<F�S�X�tAN��"���{6j��gtTi���ȝ@�
Fn+��h>�Gj7���)���R�[�ԛW��4�r ���bð�R���K���n3���h��=����v��Xe'텘�s� l�����l�0(�-��;إ��������~.5��{���������f'��JM��B��VH\\3I��\mO88��H��[�^�~��=������;�<���Q��0M��d%����յ�W��7L���0�=p�ĘMnE�}T�[��	�Ҹ4��!����nO)·�8nl��O��X� E?�n"]	�v����H�x3�~�*��.d�A
W ej��a��ݯȫy�s�GH�f��w��{�S ���_ܜޯ>��JV�h~��%b��7La1�W����L����J�����������k�e�lθ���Ė�i]ǗKZA����=�$���+_3;e���rSU�|�M[����1�êI�(�$�%Ê �zM["6YYKe��D+D��!7��;V^ �q�}�8�C� ˵���^�eHA���j��oJ�*�2�:��V��C��F~O����N�ܖ�׺��w!K;[�6A�^��F��L��ye7��Ư9%�Mm�_���y�ʵz���%��.�aA�V���-�j��{��;]:��N�3������ݶ?�Gͮw1\���������r�A�`|s{�ǱM!�u�h�~>�����}��'�+'6{Ѥ��}�]��5�� �  �i:S���Dau�9��"��^��������9��4���
�/઻5;p�G`�^�=̪Nnn�VZZ��E:?N��0Y����X�!,�Ι۽�ؔ�~b�	�]sH��4���
�D0��i�w��`���n$��k.׫��=@��u�+�n#p��d������Z���3
�ɉSL/Cu�����Z���t	@�px���V��{�[n�(�t���j>��T��n﹖�T���sNô�^tN��G�����Ľ��X_�;5����z����i�"�4�+zHR ��.k;��#K�����]��Mh$b;���l��r%ߛ��	����x�����m.��s��6Lg���o�N	YZ�m��$����s}3jj��Ć
�-����Eξ6��Ǥ����E"�8'����+t�d��:�U:���l��������s�t���:���vܽ�,;~{�%�0�)�n��px��iG:��������pu���;dY<�NH6ɠ��>�}��I���t}b��1����82]��B����*o�<#�8g�#��	��i��ה�����LU����&^��&de�mbs�t!�n�f��!�b L[�OjD�xÖ�xy������ߨ��H3�?�ky/�-�H�)�?TÖ�����W��!�im�3�a�{4%JҦ�P�H���aU=��g�F���4���l5xt�v�fd8�㻌�*����/9	ȴ::��h���"}�Z�\���o��!4��� �����t�o�S�M�ڪx%���[��X�Ԫ�H�t�}37ܮP-}����B�T�D�3�	bF�$Y�D�0�z�\�������&����5��[UL���t-�T�j#�V˥�x���hi��NB���ۣL��kTh+[�[��G0klr\�Cܣ��Ǖi���AJ�q�D4v�۸�W��m�U�2әh�x�G(UM��j�����"�Z��:�B<��D0G��.$�.f����qr����B��"Y�}C������.�{��0 [j��;t|"��S��毿��x�q,\���)�WU��
�٨��oPL�NG�.��ů*p�������lg񥔹�p68%VLU)��b3�Hݕ�W+2.�xu.dYNc+E�EFK@��j�%=m{VǮ��oSȫ��O�~�b)�qr��rG��d���u��G�@��M�A��mH�ΰ;�?w�Ǩ��{������]^�>��cgث_�ዔ�����tS=h�Σ��zhX�1I�b�9?��/�%wʫ��l.�����лڼ��ٞ�$��s�t���ȵkخe6�w�}k�~��%H�R��Mpܥ�7�HJz^sEf��n�K�6��g&����_Y��K�6UM��}D\?%�����r�1R4�������s����A�+&�sN��JE�{R�D<�,���=T���Q>cR'����P�Q���9�)np!(���HdY��A��`h��
��IZzy��J�D���6��I�d�>�0�9�↤8@�ݥ	Bɲ�u��(�$�$�V4-��>�T
s8��iG�%�|�s8�7q"�"h�I�?��8��`N�=� �C������-��"�`�ST���UB�H��=RJSє���
�҇�0	���g�$Z[�Ҍ/���_L�7^�d���#a[���	��� �4�E��`V~�\P.Ktq#��p+�{f��d <4�&�x���IG�0������y��9C^!���ٝz0� {i8b?Ep"�v+ǜ��T�̡��0,��p-��r�U�q:W�3=-g�_d4��Œ�t��g.TPJ�n?eL�;Z�kLP�\��9X�p��1��9"��I�gAБ��y¨$D;�GS���l=M�"$�H	D-A+	>z@���~=� ��_��B�z�9�2����Q�`����3\7�RǴ�<�Ew�L�&i���P�2A�2]wSr�����
'��Ɓ��,��	?�y�Z�0C�9�냬���X�OֿY1hI�	�nB;lc ���Di5`��@�2D#�1�T����p/2�I��\茍
:2��iFs>H�`��ïP���-t�hq��j��TvM�po�{��2� �$�3��-
��s���#f;�aZLel^�i��l�
+cS��$��~�0 ,;	�b����4~����2k�f%�`�=W�uLe�a�9iD,lOCA�8"�Ia-u�g*�N��&>����K�	_�[dtf��0,Û�Y���8��r̰�e �DF����&(�c�4�V�����qj����C�eNݕޕ\�ު&SF}�^@I����S��BL���f>T�\�����颎ݏ���F�����V���Т(%0���C�3�AB��l�I>��oԐ�Ә^���=���.l�-}�Vf�V�j��4�Î�&��pwh,#�PˬO���]@5��k���g!�)�&+B��Y.�CT��j�3�Y�U�����tb�[-O±� s�,2�ni��6	E�fִ�-�T�ݮ��2����Z�#	���%b@S]5L4���gX�$�1;¹93^7j2��1��������>��� ��	܅u��s�ڪC��,��"}�
#�\F�Ϲ?j%c�K���Fa��Uu�`D����v��RW�: U���,;4���m~�\�7�>�Y�"�l�"2T�;���3�$|!���J�_������I&l�h��פ���++p_`�����ڵ��
�-���oy�P�JrX:zo ���-�u�����i�w�1 ��nulC�DP�{D�h���_�F�X\����=�G�����̑�ʛwA�h�g\�ɟ~�����E����Y�f��m�����gD�*������}fX�v$������E�r6����_ǖ���=n�eW�j������'Y�w�^�`���)ɠ�����O=�x��h�&)d4@����m�`6�{`��>�����?�@�F���6ѭ:����/��Y      �   �  x�UUˎ�6<K_ѷ\a��k0�C��H6l��͡G��S���קZ��0#�f?���ͦ:n����W��h�1���&�)I&ln�>�.�\"��QR'�L�In�g�-{�r����:��v!��҉:Yg�3B���9K"�z2<�[I�N��5ݹؖ�X��Ƴ�O#�d�<)v6��	�}DE��l�0�����i��>o;C�L6F^�l�M�]�`*L�����KJ�G~b�$i�ٞm|�y��w���Z�%r��)������칹;N@ѳ��^R-��%b������e53�H$^�fpΑ'1L>�{uxd�m9g
FBC�B���1�+����JHC~�kA�h`6Z��`�j�!'��;<x9���=�%'o6��7&)���p�&��--P�GQ�R���
k
��Q�����z#wcK�#ۄ��7`�%�t�R�	��7�"ڼ�eh �
�c5X��%zV�l�I�X��
/�WpcFD�5@<��*p�`P��H��<�c�6���i��*�����tyS�$�ouBwf� ��5��Y=l׬W��� �:�u�L"14�Q�2��
�r	��-���2�H��������j�?���H��M�����|��9�#�ʩ��R# >���s
�
�}h,,JM|�y-������*�uX���:!�.֛h�N��2�ʳVV��?/��?!������j��ȭ���E�;,O�vSm�;����4o�h����Pm��zw��=b�s����	;����B���]{��KW=v��V<�|y�I����ϻp�#6�1����@O��?���n��J�z���k���5�W�S����#�b7�jc0@�><U��ڑ��>+��|r�5�O��_����_�PYq���u�@�F�      �     x����N�0���S�V��״��6�p��t͔fR����iG��*|�����(��w�n�	�O.��
mmir�R�AI�C�RG����D���uWN��G�.� r!7y���������
a�-V"&@ip���� ~kf���>��<���k��Ǚh��T+��V�*�1	(���6���w���%O4����i���%��+QL�R��	S�W������/P(�Ҧ���SM���3�]�1�.���~�Uy[�+�L��X����1��5��      �     x�e�Ks�0���Wx�Ҹ��-�^c
!	P�e��,c�`������&�V�\-Όt�s. �'Qz�woU[f	��EH����d�mn{��tE����G"��f���t�_iW���I>��$!W���,
D0�l4�*@m�۔k�MJ���+Uf�Js΁��+*�=��t�"MO��'T�HJ�n��(�ڣ���&s����6l-:}�C>��l;��b�h���1Ϛ�f���`���]yQ�D(N�^�P�Bi�"-S�R�":�y�/���Y&f���1�f��BN�7^.<�x��'k3(O�����://�EF=:�Uw��?��r��*��0��l�J��@t��x��w7D\�X��W����Ϭ^s������w����������qkj��;�3�>�~��k� �r�F�	Ü|�Z
�6!6P��L]�L239A����ƛ1��/��%�J�ȲM�.+���EQ$���V��5���C���Ge(o���߭ŏ.�b�HtӦ�F�I?Rb�:\�a:�2Ys�V��3���      �   �  x���Ms�0���W�p���N
�+ڂ8����Ԣ������v�:Yd���9O�	��;"����C����NU��wd=�lnٞ��B��VZ۲p~��X����EJ�zDy{�~܃7 �Y �������a�c�b�A��D�@؂�Fd�Myᅽı;f�H<*��O�@w��aK�����J\M����S`a����7Y�<44u +P��F�@>*�/��-I�vSB�m'�!��U�тG��EVՆ�/�w���%NIط(?�q�j� ;_�?��?�ED��aR�h�5�)�Sr��c�\1>9��T���eo����o���&C�H���&����[Y��y�H�3D���,<mzL�4y�-oz$Xn�<3Ya������)~���NY�9�K�}J��XJ�P5���4l�c���%�Z�KI���Cib۲;&����4�3u���ݛ�j���}��     