PGDMP     )    +                {         	   eCommerce    15.2    15.2 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
    public          postgres    false    216   3�       �          0    107168    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   r�       �          0    107216    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    224   ��       �          0    107413    orders 
   TABLE DATA           �   COPY public.orders (id, created_at, modified_at, user_id, amount, transaction_id, payment_status, payment_details_id, product_id, quantity, order_id, vendor_id, address_id, order_status, hash, product_info, firstname, email) FROM stdin;
    public          postgres    false    235   !�       �          0    107430    payments 
   TABLE DATA           �   COPY public.payments (id, amount, status, created_at, modified_at, transaction_id, product_info, mihpayid, mode, order_id) FROM stdin;
    public          postgres    false    237   M�       �          0    107196    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id, avg_rating) FROM stdin;
    public          postgres    false    220   <�       �          0    107220    reviews 
   TABLE DATA           J   COPY public.reviews (id, product_id, user_id, rating, review) FROM stdin;
    public          postgres    false    226   &�       �          0    107226    shippingaddress 
   TABLE DATA           �   COPY public.shippingaddress (id, user_id, full_name, country, phone_number, pincode, house_no_company, area_street_village, landmark, town_city, state, created_at, modified_at) FROM stdin;
    public          postgres    false    228   ��       �          0    107234    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified, isactive, recent_searches) FROM stdin;
    public          postgres    false    230   ��       �          0    107243    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    232   ��       �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 243, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 119, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Products_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Products_id_seq"', 114, true);
          public          postgres    false    221            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 35, true);
          public          postgres    false    223            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."newVendorsApprovalList_id_seq"', 22, true);
          public          postgres    false    225            �           0    0    orders_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.orders_id_seq', 213, true);
          public          postgres    false    234            �           0    0    payment_details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.payment_details_id_seq', 45, true);
          public          postgres    false    236            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 91, true);
          public          postgres    false    227            �           0    0    shippingaddress_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.shippingaddress_id_seq', 4, true);
          public          postgres    false    229            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 131, true);
          public          postgres    false    231            �           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 32, true);
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
       public          postgres    false    222    232    3312            �   (  x���KO�0���_�;��k{�����C���-�	JS$��8��8U�r������f��h82���B��T4�H��{P�P�Hۢ��)S���95��ӦKu1�МȰ,��yU����+�GV�[�F]Jt��R���?vR����VM�d"g�JK��hȷ��@�Ed:[��.�]��8BMhܸ�&x.7M�V��{|�wD�H�3zDuB+��_��	s���OԘ�)wM[�6��m�_���|p�hTnf���?j~���c�uU1��]�S�IL0�D��y�W)�����      �     x�}�͍�0��vi�!�Ƶl�u,�6/�"�6���dSk��x�|�؏1bi���Cb���e���9a�/Ŗؖ�@X���`,�˜��/R�z�M��d]`��z|K�m>�ȁ�8�$�2;. �ڂ�$t�R�����>��6�l�#9:FVc�����������A�Ʃ�}!��œbj�? �`a��-~T�P*��E*����c��2���ª2���t����@N�U_��Z�c=�A|�G圽q���H��z��7�)      �   /  x���Mj�0���)|���H#�@���t㤦51ء�d�:MJB������7�v|���qҠ�	�dU�W�#���FJ��j�;5*5��}Zl\�&��E+�3d��y��iƾ[:)��LlUg���"�B0$����� |B)�H^A�y�a�z>����~=����u��IĪנ�@�������:gIRz�@B��+C��ò��R!9���eȧH�1y%(Nh^*�<���0�N�e������=iƨ�~���!T�����#͌����ap�`]�rOʌW[U�7?��k      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �     x����n1���S�Yy�c{�&����(AB��@¶� �>}�)Ti*��+����
5�+����#A���fo���!	3D��H��꥘�o�;0l��.��W�f8�2V9�PACs�һF}��u>{�߯�M��:�0��Bl45gD�b
Amn�^k2��-�l�@��I�*P�_��m������x�/����bL�,��
�Z�����w{����(�M�	��hM�n��b0�����B��G09҈	KH��HО#���$otD��i��	��3����u���n���p8�@�����K7�D�3��*өc
��T	^]���u�ȭ=	��$I?�~��>��}��$	K�IEm��{���B��-�i>�z�7�σ�u�+Cʕ:���fq��|R�]PiϒBC�y�=]P�cQ���F|Ix���d�e��L�K�"	���b(ڐ�A�r�v%�̭;����� 6N6��E'�P9+2dЦ
I�����QH�L�Ik��V�H�$���j�?C��      �   �  x����r�6�5�y��A/w'R��]�&�bU�2%=} ��%3Y�y��? &r.��lq�8b������O�~2�'�DR�oQ�P�:h��Oĥ��q	�$N3�/>��^/�t($J�ÊRt�-�iL�Z����_�EmhAF��Н�8����&��q(��rx"a�r)Q��w�鄣���&\;����,��cz].�3/?:Ɓ���+Ʊ�)�[=��r��z��>�oF�z;vp��/��>�\��`q=L��#�hNr��f%��c�!z;
���^bY�z9L���͍9�z��b���u�.�KԽe����c��5dp�Tײ�Ƒ�H%�e7���&�x"�bb��5d�O.[P�@��NN��'�󡖅��� akȽG��d*�e�q��6z�z)w�@T�EL��|��E�;����>�\%�l}�]�!��g�� �7U�UX4
xs_��"\%�����%��poVd�U������i��!�(�C�[������.bb���U�t;���h���zӊ�g <�� ��������xK焰�"��q�db�od�XGW�ҊF�z5��G�rX}�?����� �w֙Ѻ�����o�Is1�/����aq����Ѝ!��)N6�5�����}�� #�`![�b�l6�s.S4i����[n�a:���֐����͚1�C��H6�"ZT�r���bb��;k�W��T�>^���$����ا ���8��/��%K���eC��k(O�H��y�Xz\TՎ� �o���=�����5�<�a�EDr��_��R
��W9L����j��s�����$q�A��@��E��d �m:��j�r9�
��Jʱ��k�ezF���E1���:�@�&d`z]t1ފ~���"���K�� +�rDw'��K"0U�O��-��*�#�c2@�����?�A8�
B M�F���<���1�Ы&�~N��77���f��:H���~�,�\�&�~Nu�-�����TC�����n2��51 ��4�{����L#Q�W
����cy��@d11 ��]eY����	��.F��1�5��Z%�b�1 ��tu9V�eͪ/����HR���XKm.(玗��b�N��W��Kci$���F�2�e%z��b?�Fb��N������䲽����f��o��I��7��Q��1O74�!�(J�1a}[��7��Ȍ�&D9TYJ���5�_�D�f����|�HK�{����d`I��|u���b��W��H�j�g�z/M����8���}��\i܏%"�Y�Ϻ��}妦C����bb@�}Mjt���ժ���2��I�9�F�s��/�Ɂ���)awPhV�
�d����6�~���׋br@�=�\�������P8�Ar��~�1���pL19�{�َ�����׼��HI�HvJs9��1}|���51��O �߂hl'      �      x��}�r�H�޵�)rj��U;$� 	�uoGP��)IT��RW�D�A16 Jby���ص}�W~_�z��Qf`�>�9�	�dUώ퍝.��������N��'?���P����_��0ߪI���}����l�.��!H�u��0��@M��:�r?�8H��ؿW�ɳ���M�H}�&ANM��� S�$UǛ(
r��d��~�.���;����/��p����G?�y��m�F�.Y�h��MD=A|��&���(��Ͽ����}�σ���Sz�L������:��a���x6�3|��_����W=�n�I�u�
cy��pR�x��z)ڪE�g�i6�:f4�,�㹟�U~
Ԛ�V�>КeZ�t�r��*�ry.Y�'j�1�Yf�z�i���x�n�%7WSS?����?��jX���G㤯�j�D�[��ᣢ�h�7Q�Ni����>F變�������T�+?�L��:�����TMuhyz�8��4Ih���\��8���0�=m��Zmh�K�1���0����y�?�i��fi���4ɓ|�x!s�S�2N� k|��v[��u���J�����:���Z�]��V�Y�nR���}�3Z[�B��:˓�^M,��_WDAj�UK���D:�IOːf��i8S�&]�D�+?��@���T���v������~�'?]�D!�"=��Z=گML�����~��i��� �_�鯹z
�>�E���Z��t�䓊i�O(��rL���f8�K?S�F��L�f�P/�$���]��U�YM����4�AG4�� c��
�'mh�O-��>��� �&�l���?�b�a<���S�V�lB/<a�N�G��T��k��VM�>m�d�^')�重?O7�5�Dt���>�ꑿ��-Ӭ�؀g�l0y k�i�����|f�)��}�i�c>CL�5�A�3ôRC%r��"MV��sbLҌ�֑�-����d�m�쁎��Rӄ�	��Al�
V*-/�H^�,$�CD��S�Ҽ�@��L9�"����p��< VG�o������[����9O}:�a��闌�<�%WٖY��C�3KS�8�=�$sy��+�'0Qp�t�Z�;�u�LL.ٝ�J��ט1_$�ý$�-VĔ�;�G��?�kõ��0[c�V`��,̲$%v�ϩo�o'�;�5gBt���	�fFFcM{C��f��'a^8c��@���O��#['��QmwNoN����!��P��2"���Ŗ���S��Vs=�T�SG�X�� �ךe�^l]��u�B��n@��������v���������ău��>cq͘3��uM��o�aG�j��5��m��$4^�p�$Ky���}\9m�O�_55Y%8r�6���Y���2�NJ��(2 YM�D�'$�� ��m��\��4�����kF9Mi}��<|�/G����f<�h�O����<�7t^���� U"�4
�{0�!H�ǝ���^����t�Hʈ�s���2X�&P�C���Ai�`�$&B��DD'�e}��#��!�ܝN H�F�xE�c:q�z�4��l"[�)3"V	�o�,�����V�y.rþ�-���}�l�,P��2!H�1}�'
O��Dm�ʑ�P>�r�r�#�f�4�����ܧ%ӽ��l����̆:ϩ�XT�i��o�"�O.��EJ;1Ϙ!�THxGs~�;��9�&/N�4_���� uʟ=ԉ���kڴ��-q��Z�K&� �v#{c�[��B0�o�U�P��*�������n�Y����^<$.�*�@�:D�q�f�OI|��}�z��wӔ>��?r�~���ܦ۪7����qNk�$��z���~�;GN�w��^�'�������z�f��u�n��s�����E��'?�pڽ��7����ȲȎZ�H�����::��+bQ`I��Ѭ�c�j&�	�-�L����p�Βhn�0��$(�N��w��D !�x2���p�Ǵ�imE1kTk_� �D̭2�%q��j��D}�'�<g���O��hm�r��L?G	5N�=̩�a>K�oN���*ip���N���6����%�L�݆*�}E�}��[��k~�zJ�+���&f�	�C���YD�o�%7��,���V
�2���|��⤱�/eD]j�}`DϢ��F�-ň���	�7�qb��;�!��dmO�K�1ߌ�bE�!�q�O�������D??���4�爨����t���ݖr�A�4������UO����M���Z^���i흜vϥ�C��W������Gorw�OQxvԑ�Bݞ�/'�G��NS]�2k1�X�"�r�����0\��u����uB�Q���f$�O��ģ�$�k�mIm�=��	�:b���4��i�t�
�s�5�Zͽ�ZdVu�w��4��N�q���b�z�C+�i9�^�[�8?_]=o�ɤFC6��K��9G�G��=b��K��#b�CҮؤ��<1�6�zB���B����Ώ�~߰��s�g��H�V�m0��i;e:iRD$��p�8�ڞ��:MZ�:	=��:.O�+����;��(��߸f�5�����/�n9;V�Ԏ7��:5�xX�ؚ����~y����5J/�c5�m��ucp��	)F$�l���&y����9Yt�,!A���7��D�s��\Xp��� 笊��NH+���и!������#���v`]� ]9�f�Ag&�mR�?�
�7}O��'��o��A}��,�-�3֪�n�3�U�����@
׬~>����jG�'��jh�w�E<�i���5vEx��4DG���:�v���v�۳��~L����O�+����I3x��r_����v]v�5�Mg��Mq�pȴ��e�	�员�/�ڬt>��X�w�yE��z񟼛�<����H�#nf���?����I�VC�.c��^��w�cxe��k� fh~1�Y���2-��f���oF�#H���(%�59��]9����?80����`G �!�F:��t������*�Qy���o��֤hx�3iNT<_���zS�	{Ykj�l��a�q���z+���n�;�P��!zK��˫5Lc�MG���������s�Y8�����~8(x�:�$U���P��G��?Oz���A۠�z+#,A$Dy�&I����0��'��o̪�#G�؄��v%V�f��P<��p�u~�0I�����ژ�|`�L�s¨f� �6�`M�W0'Ne��4/Y�������ku2���R�;��'�Pڅ0��@/Nq23꜌s��f�*�v�A�֝�5g0�mbέ_5�`3�ΔXq-xt��U���I��x�N�|,T�/{��x��$��FW��~fI$6FĆ�
�fm���T���Ln�̈ʬ�򃞐y= ��?�Oo��Ǫ*,	�]���RT{���O���cm�%��pZ�^��B��!��O���\�o��Yt~~�*��Y�2�A�$�dGmmvD�%ζZ��fPS����#/��N��5˵Y;ȕ�ݠ��2�����G��i�����q�+[l�]�γo�[����؏�f�iAD')�.��'@Zl�pH�#��M>���س �;i����Z��!֍��*�3�^�\���u��!R-rv)�{(�����X�ȉ��	3P�/)�����);�)'d�lf��Y��b�Q�1R[�������A�kx�f�,�/�A���zH=gҝ�Ϻ�'B[U����{GD!��d� �Y�:��>6. uE�:�ʞ�~��	���\�Șj��抄e��Gdq)�޽�s��6R�>"ҭ��m��S;�F���$�,�E�n�c�}�����p�S��x�
ƩÙ��@u��B�]�V�8 s�e����sY�=C��S�]�k����OqL�g�n�L�i��؂�"lÛ�đ(������8����p�΋�h�.������9Y��k�o��.��K�	VpJ��Y��s������;;{9<���aǁ��ם0K���F�Ki��͊�O�L��=N�|����C�چNysʮ�B@�[do��Z��E�?���׽Бi�b��    *�o���=Qp8��z�$k� s
�g�击k|�yKG�M��cr�'o 7H���z�V���~��{��������!�D��8��W�#>S�5��D:�I\W��&Po֓3��Z/��R�S�:�LY��^,4�F���̊�.|�8[�0���v��꾜&[ٙ�0��W�I%c)kܒ�1's��4�(�o؁��m�b���Xx~J)����r����a���l�1\��ʗ>{|$��W� 
&�Ɋ���	��!���״¤�q|�Z��3�Gd�M���������U:�˘��~+�J�6�O�f��u+6�*j�Vm�'?��-H��`{�ARZ	�¦��#���8d�n�~��=�Sm_9݁�8M�s������Ȕ�{n�HG���M��N��?��	NT�w�YbT�:�c����F��!k�q�q��4f�EK�!]��}��1� Y�4���u({��Xu�4N����#&:74*v¶A�0/��'�"!�F��x����Y�t����ӭZ������&���ߓ� �6�ub��$�,fz�e�mh�D�k:At^m"_H�mP+M9�X�"��bb�]�`fݾ��*������@�4�k�LS�bD�qf��6�m'<d�ӝ��a�q���%�-����%f���>C��-]��֧OD04���Cg|r���F��b���a�� ���P�b�|�T������c�5��(�{�~��ݴ��dY�DR��$���v�b�/�-��D�:����5{�ğ��t�_�� �A\����N���t>??����8R�?zJ"���(����d]uj��֚��P� =�,�~"�+��g��$^�A�zeٓ1L��#v�NK�K�	���O��7u�-z�#=�&�I��F�kOB�b�L���ڴi�V}��01��"W�X�9/K9Dw�&Wr;d%� TV�`
e���,V"�����4���0c���TGm��{A�k�>F�<��� C.����L�fQ�"ed5~7OH�X�خ/61���YIL�?�%$5{f|����ެ�Z�w}m�YM�I|~�X��jH�Ԡ1Kּ�jx�n"8�8j�*yۢ x0 3��k�V�#��XZ2����TD���NhbA=�AeZ?* >0��<�:���:�iI�(�R��o�1��P�`�$��4���`�Y(�:�D�/r�GM���(���=�Q�0M8%`Sk��*�u�J9��L1|�I1���]��L뛵 [����B�fkX\�MV׳2��1���֥��R:ϰ�����L��G�F�c/+<u��ug���]�L�z����*]:>����������Ƭ�xĽ�}����pR±l�c�V���z�mA�pβ��:ju�lkW<3��v�f��j�[�ۯ��5���S�:���su�(����r��Xv�;:>?Q�c�������cZ%�#@2�HAlPI����h�V�jd�]�H��s��
���cb|�N�1���H��eU�)N�|����N=�TLv�L0)Y�Eb�<�������*�DQ�T���k�)�<�³u��!&` mzcchwK,Z�%}(�63� �;�2m��a�>"�e/�H�Q�Ӏm�����?}Vgi�:��K:�yx�$��w��YZ�VZzG'7�������ܪ�����|x1�ˍV��8?�ԡ��o�`�^���F���+!:Y
��{��V�г��g�8,=)��{�*�5���o���'Z��8�Ԡpp��x�{>{�����,'68���z�Ys���G��Io�]`.:=����5>�n��uZ����?&��Ri�����b������Bxr]�D�;���d�X���N��"89;:���;8��[W~���͘��i&T����1�Q�to$EK�|���d{e�(�CV)�9%��]#�8J̩�`��7�l�=@Y �,6����.���.%��?b�]0�`�rT5�4�fxy~�Q��F�Z)_�n�ԜҪ�m����WZ����d���$��Pw�X?�Gf�]<I���]�!T6��#�6���cZ�+�dY��γ�u�lT�c�fV�,�N���e����z�*�o��k\��l��~���t��<���~��dϏ��;v�n�A�ſ��/��C,�Z��WN�gy��2"5�La�2Б��t*bhZdǴ�M"�{�^�y#u����6�¿uz��
�Kd豔N!��E�d�+Wz�k޺h�'��p�H���]�r�LUG_��N�~_�a����̀��q\��7���ӈ����~G[����b;�V���E�|�hz��Dc�Hg�@OA�ɔ�;��ZXst���.�{]`>G��xYw@¬��yN{�:��&YGN����{0`��v:D�ax������bg���&�dP��d�Ĕ�8��l�� d�
쉺�������n۩_�{���5]V�ܶhkꚕ��-��0�7�Z|l|� H��z�]X�$�?�鶐����c���iY���� D��\4`M�.��+���>@ƍ"��X���*��q�q$��
6���*ԴkT4K�5E��>�`�]�N2����嬌�c�=���?��V�P2b��#�"�~e������~p���n���7�Q���.ת�R;���6�iH&���_�خ��_��^���V����>�빽��!��w<�\ޝ���ki\�Rh���9>U���u�ũ"�C<�Zt*�6:OJ�*5L-&q�D3z>�6u���d����P?�~�վ��T�>�Ɔ�cf��,�"R�:�d��$"�|v�Ninhlv�Źf����݈��N���YXr��:{����1�v&���@�����i�{�p�6���O��W�a�~�s�q�azѩ<	�7��0Z}v�GW�cL�$<�����z�������ە% ����q���+j�d����{�dsg���S	tH�L�&�¹�\�@/Fϐ�>�\:�Z7g� �/���t��M^^��Q��Aj�N��v����D>A"����gy}������`"U_��y�hxE�K�L��[�\�$?��/�'���sO�x�2��dW�}�#�h�q���S�!%��XC9�5�[I���j[�b�:����	D4x�8��u����s��ߔ�r�.��q�x�o���!��)���P@@n�u�%;�4����݁�mx-����������-�[F��O?��|~�:ػ�������>���Ҁ�N� ��ж�O�P���F8� :��hPg��T��$�s�h@f�ȃi)� v�����f@� X�속KmY����\`�`��ɀ��ê����GJxZ�j4)��j�^�Z�����������s@V"�&�0�J(���3NK�?�eա	�t��JE�rzg����LA@�g�u���niX�dNˉ��d�-�h�^|&�Ynq����p�-��X%X��#�9!u��/�J�	��'VF��v�����)��F��vQ~�9����/u��a�w�C��j�0?���Vu+G�D6�j�TH�ٶ�e�DgF'�d��+�7�F��u�%���D�9h{�nV�3]��"���y����s0�)��@(�W��o����#lm�=��P#�s��k �l���k�&I�������>���kN�7��|��(��[M5Ɯ�H��҉�B��l�#���8^��Wy�:��:Z:�?�=�t~>���`�q�8���X�*U��`jf�Ần7)٥!��2D��1@�=�1Dv�?j��~��:�/O�[��ݦ�u�D꿭X�i��d}}�O���~���͘��H���OF�潨8>���j,��h�o��8�y؄!�\0��XHu��N��/Q���e�4D�2�����ٌ���V�^��9S(�@��z�pAN�Ȉ�-�3If�A���O �3�j���&�j_���� l�
�S�ϑ���k5:�� B���M��������a"�A�n����c�r�    �:W��~��Q@�2���_lbNz�H�~�?o��4U`8�%o��cׁ�צ��.�ay�.S ��)�U�	;���F�ų����^�q^���ۻ�={���x����#<C��n�>b�4��^�}��n��+^g��2�'���@�5"��Q��X�5�V�}+u�E`�����ˣ3�k��z���eJ����o��jK�h��d��g�<�i��a)�I�I�j&zj�� wu`v�rIm�����,>X@��G��A>�~���	� ���QB�Z*':��kM:)��+ҖH��|�t3�_]�y�d���8"� h�Xs��0ak$�h�D��-]�!O�'
�y��4�7�l��HRBikxv� [����,p��P�~���V#��2|�s�Q�Hk����hw�� Z/�F�,9z�F�U����?��3�3��88�Bs]|���������@�H�Z���\��� �K2��¢�8B�}�û��k�]��F��\7Al=m7P'9�_՟J�ں `�Bc�к��<	C���;J���i���u;�ĐL&�v��)��}S,gل(�u���E6�ZC5kg�R�cGCr�р�SuΌ6N1"�:e�W�B��I�AC]ӹ�$��4U�\�;�X$�3�η�2��S��*�<Y��x��mC���gdGn,6�����������n��t�nk׋X�� x�CR�W�8?9W��g�QT��?�z^UC�.Ğ{���[S"���߲	�U��LE�lj��ksqDH�]������k��}v/�n�Ӯ*w���D/.����޾��nG���T���t�c)��ip8�FV�th�u��M[�f��\:�	��6��[!z�$�DƧi(yb�J�Q�XZ��N���e�c6��bX ��
��^G�|�0�D�C`\��:�
�����O�1:�p�5L�[�e�_p����q�4��k�T�{˼ߤհ��=qܶ�#�*-VJ�H(;���x��(��ŔTâf�A��[�[Ԑ؝�-�zZ�B�0R��MLK�	W��i�}C�Cm
�O��>Y]֦�n̛s5�<\��\���y��Ll���9�ӷ
��_%�y�A�i~��c��ʢ`$Ҏy!�S��iT�r�����x���5��P�mСc��k;�J ��b#-�,�6q��E �H��������l����� �v�u���r�^��mV��?�Ȳ�Q��s%CS�g�l��NM��{ e=;M)���i��	d ����c�?(�+C�aqu�6t������ё@Nr��[@�����Vؓ�n`��/n�����])�Q��L����R���)Ic�@�a_-��y��&TT2e?�`�]����y$�nK��i�y��~uqS����n&&�9��_���Շᤜ+�3Yt��k?�8�(��(S�rNh3���8��bӨ��4SC�F��[���!�(�I�}0��<`� c�������9���7�u3�~T�c�Y�v�̕�K����!��k�1)��	��NQ�?$ƕ�ŬAI�U�l��0?<�������ňG�axs>~?Q��G5~�h����8ǜ������o�#ʉ|(�����2/�\���s�xE�χ��DJ�Q��,)�5����V��$�/�m�թq<)O�i�q�cA�b�кj��f���.����8��������n>���
e��b�G �۾T-r~�2�h���\ x-�#x2�Ǧ,�z��ɓJ�Aq�3)��Zb�A��|h�����*}���o����iZ��r\�/�Y��r����[]��^���7��8_���
B��u:����9���O"P���(`�V�ZG�I��Q ��+[J򌳠�cR�_���y%��닐k�n�\P�G:���D]�/F�w�W#u5������L��{�������J��� \��U�t�0�zw�6�H+B��QE��i ���V[AP����VZ�G�X`�"]w����8}ü�d�atc�kBŦ�9�O�ߌ�6S�IR��V��V���z�-��_R�Tڐ��&}D;�VCd���n����f�{@�A<&�V����ʖ�7�G� d�}#H������7���Ë�ۏ�:&e� �-�D��:n���ȸ�f:��r%�E.�)�#<��Pl
ꝒHFa�@a�)��L�l����0��*S��Y0DC�zYxP�^�m�.��8��p=|;*��7�痝K��'�Zi%�:󗡬�cA�����t����Iz��q����e�)[RmGͷ|B��@��0ȕKR��6Q�%��d�
>��+�^��iz��14�/����m㮗یqY��<�'�1P�و�i��@���T�oR��_��1�V�_ 7�8���J�M�ေ�9���t{����5�M��t?o,�zH?��z�9[��/���l,x�Xh�!Ŏ���4٬�݃�[6D����mM��qkZݯU��[��Z��Z��V�U�����,�w-��	�ӧ�+e˲r1�c.�R���M	�w��R��_b3���E�@�(z6UV� 8��ɼ�;�*��*��k������X����T��,!��Tυ�K��!~3�<��!2� 	�f�-����-&[ Kb^:�^����:����CabA�_��ϛ�[����Q�+ֶ�=I�A7�Yo��y���ZuO]�1�ku5:M&��)#q�jJ���qy�lFh��Z�0�״�C���:�A�^�Tc�2���ͻ�:Mn����٠D���dP���/>���c�X�7��ZU�#��_Q�Յ�0�x?b+ٸ�Q2�*��i�][�H�`[B��a�R�>I2I��cO~.��z�-���h�^%V�T2�ίN.ޟ�QD��7��������l�_㵽C.^���K�t����}��#��nv�f��x��k9B�������&<�8���b���\��}��#֟��&�ԅO���ʳ���q"exǛ{�v�,�������D���o�}����_�����36p��'��'��!M���5~�A�"���
:a9��w���QO&jG�ݎ��B�{:�V��kC>�q/Mz�'5��3��΋�*0x�(걔~U cT2L}S(^�9&���4�����#����Z��9�i-�,P^����)a���������.RH�}}條�4,��K��T�A�3�*�q�k�D�]Qڌ݁(�Ɯxc�p]"�p;S�̯�K��DrU��:r�+ц8�~@t�����\dG�jms��T.T�X�*����y�|p3N:�嶸{��w*J+�(6Ia/j��y#��&-|Gv'glB������||ٶ`���ܜ�Y�ܜ�%7�7 L�qgE�H��IԈ\��������VnXzT(]��Vޏ�؃_�b�:$F������k@�Z��.w}h�Wg�ٷ(��PUd����0��H��������&s���FF��"�~\�ĹFL��&��+��enTz������7�����aN�U� �����9^�I1 `[+B��u9����"����R�}�cq�B���u�c��e����P�Ȕd��`���V~��'��l����V�-�	R�b'��~����3�,��+�md�?��y�ݻO;੺_T�N�wPl�����X�!��E�-96+}1N�Z9���D+��2��<��;]`�
U�W�I��
���.*�Yڨ��%�o9�]ৃ��n�T�R*��p6_��n�۝�A��f�k�\�U����ʖ�Il;Mj�!eT+�㵿r[G�g���_�G�m��l�S��bH����%�F&g�V�}"zx
��z���J	�C�rɃ�KYZ��_����x�*�h'���z���Uz-`0H�˽��ߖ����}�����N��"ݽ�}�w�'_ȫlid����4y���I�x|�n�E<s���j8ۀ��{IvK9C����Z��	2:�Ț+�<a��k�A�j�@�7����*W �ΑH �{mսt���9�����{��@��ӗ�WSN�{����s�SDՖ��fi�
���>T[�U#�4�    }kl>R0��-�i��[0s����eVY��A���H'�s�oI�Ɣ�ԅ������\�q���Pc)X%r�E8��&�+��"����¦V�4�(�zoR��/YS�-re�\k���+
�jLg�Mi�q�~f&��M��ͯ�ډa+�#YY:�e��0�W&1>��G��qiք�]��iN�����8P�]�lH�FOJf!��t˗!�2u��/S��Ͼ��/�;��P�� �(�K��Q�Pe �'��l2=�������!^����oP���n�#�*���p��.W��'-�K��(v�jch*���R�u�:ÍR���r��/V��uC����K��3�^ͳF�i"f��j�o���R��~v�N ��v��˫�����Ԃ~�)W�|�^A�mz-�[�:��ݟ���x[+����{���������a��ԕ���������׋���;Z��(7��J����D�+M���z5"���Do<L���%�Wp������/������7�*~�Ͽ����(C=ʕ�|"̹hcƙ�Ĥ�G>g�1�8�ja^B@�=��v�"�rV
����ُ����R�0�rq��ޢ�
QZ�g ��3��&�u4�M'<Y��T��19��Y!V>vt"��S���h� �p��x?�(�|U�N�����5�T�r�M&cZyQ��j�i�l����]�'�&2�����017@�2�d�nV�$|bc�����d��_��ލ�ߞ�ݷU�I�p�?TY�h�����TM��pb�Q��ҧ�&�X@&v�a�Ӏ��>qD\�3K�DO�Dꗧod4�s>k�=��&�� �4���`�-�]6Z��8��ah�D��Vo�9��(^Y����`n;%�O}'�M��n�i����G�☰Y\Đ��p��4�������{yz&k0	~���jt�&��/.�$�(�H�:#mD��6Y"2�F6�R��v8"�E �O C�N1�)s7�	�6f�ÌI��\�h�8�`N5[��%�2�~��(��t��b9:Ѧ��=�:j�N�Y��`��%)TRK���%���H��Րґ�&��������]�IҘ$:���-Q(ag��Cٲť�.BƏ�$E=M�!����O�@(�S)��!�Ib��7kiX�4��Ҧ��I�#\ס�ٵ���<X1��|��<�@jD&!k�cFP�,~D�o���hxo��in�jk����k�j>�k�`k%UK�K�w��:=�(u&�eM#4S},ɍ�	���\B����9ù©˞�2
����������[���KZ�m�l�u���e�m-N��F�(���_U���HM2�Qۊw�E,5�L��I��P�3	���$�_������"��6N��wJ9�����mS�0�q;��{�������_@�6�jt���_uܣېT�y�&�>�1����EU����r|I�\�&�ɡ��m�xr�~��㪷7���[�������PR�_{��)ؽ
V�P�Ԑ=ԎZ��k{ٖ�ЍF�
��2�[*z�%*�B��OSZ�R�E��,jl���x|: <��nz`d"���4�!�5$ ����>�ô��%.!�i�3��yņhࣸ�EA#[�;Ee�	S���		���Ztm���qJE����������H�n���� �Sط~��;���c��Y�3�ϰ855�M�d��n�����c)�.`+�g B ��b�'�7��}w~:!���fUJ��C0�8}_�K����l��HWH٢����	
���h�' x ��Zc?�����^�b����Q.�&�B.���m��� K�$��6Q#[��U2(��~���㱓B��:�%Q�B�
<�{b	v��#q��N}2@�7��њ���S�d]� 1��ӡ%ӈ}H�c��͸�?�"�ʃ؊���N���+8V�������[��
��N�Y�����.���՗w;Gp���
��0Z/�)��a�O�"��r���֠�!����҇�2�H�G�*�������q(.e۾��.l�}� ͎6���f��LIK�Ԏ1{^1fiH�z|�nt+NÁ��p�P��V�D`_HE��ր�Ѕ C���Ÿ�Њ�p�~;��\��W�}����[��+�@:q{_�s t�Wj��g����'c�Vy}~r�v8�}�/����˃�fXfԒ����He�v��yf-��l��P H��_��YEm��ar�tն����Q���Wd Ln�5`.���Z�T��R\��F��8~S'����u���MM����N$V��d�-� IĲ��&�x��A �k�I-����=��Hol-䐎 �-������"b�W��'.ѰHSxm��w3��Ѵ��%:�a J8{��T
Q���׷&�:7�!��ܽ#���*�O@.R���ɵ�^�P)Ɋ~�>x���u[�^g_?sۍv���eR>�kw��'����6��ҳ<�y���8��G��}�a�Sғ��!q3���i�����q_��"��7F1��<^8Մ���BBu�Q#V��
�Tw�2"�9�(�;Y"�>Wo��pqG� ��.�L����۫��ࠐ�G�Z�1i.!"�E��%N�*Ҋ��(A�iaB�3�N|��(b8�y��	6�U�(�o��&�_�H�"R���8_3ܚ����nE��)��8�'���Y��>s{7�������%��D���k`J���1�Ð�u�s@��lDr�G����F�V���R�-A�K�s��S�௯��W��}�nt3��-޹,��lG4���!�L2:-�����QO�1H^Q�zi�0\͵�Ҙ�h�����:�M�bA��d	X&H�w�0 6J2�N�������b��c�=H��G7磫��/�qbQ��*����#��I���m
����O״�8NJ���+*WiP}����6�d�;B�cXb�Z#�/��V�׵L�\�R4����Qk#�57�M���I�$b��$7�<�ܔ(n�ҩ����hr��V/��ǝL~j2�8�� d�;�/��ݔ�����5�ɚ!�wx{>ys~�(�R���������Ǟ�-t�_��oS|'�����1������f�$1Y�'v�Þ\pց�������*������Vz�����
��KIk q��<��Ùj�V���VZz.Q$ײq�Lk+8[X��d����cƵ���!�:�jW�.!�j&"ɘ�����ݳ#\����<{R����n;_��n�u{�z���}׍7�/���	ԗ�?	��X����*W��������d�=�5}�`+ r� }.7s�nT�غ��(�:.�V�6�qP�Ks\W�q//��@�5W[4��tw�w^��r^��=���=D��\��W��-h��"���!�Ȅv�&;��������
b��1��������l�7�����6p�nJ�^_�&ֆ&�<�U�:D������J�o�q�[�L�C��S53��j�T,
��-�p���S��'1rm9?fP�I��1���5W�sO�G���5A�c��2�{А����E���eI��^��1T�2��c~���3犂�}P�`k�4w�ޯ��~U���;O��\�.@��9s���mD��(B'f�++ٵ������L5����0׵��,,�,IU,Q��d�~� ��,";�J�E_-<3���*�@����n���l����Hp�k,��x!�7�*�J�"Q�4����M&��Q�}�q���Ed�F���=�����	�NZ
J����)kr\1X^1���J|)�=�޸�En#6��uBc��
on=*�8����
������~U�x�����-o�G�q�Dr�K�nt���j#Q��������.�h~�xG�7�?��cTW�ֵ��⑺V�����TW�6���o�`���r�I�����$֌��{�r{�����M�h�-ћ'�9*�e:c��r�5:PS��%n���[�w�<�J>�Z�̫"���,�>�*V��kF��E[���\��� Ċ�2��XW��lԀE�h��X������E�\���Ѽ�8>�����2 ]rPCj��d� �  �j�d��� ��4���^}�yC�7חyh�M��G�\9X��cY)�줽�+]��w/���J���ʜP\�]��2�n�q;}��%hj�u�S�s���w���w�Զ�s�9���k&�4��vt�C�N;)�sK��ʭ�\���j%�/U��#�F�J͔�+\՟�ցBd��o8���Qǟk�r�!�|�˻0��"�=&����So��k�H�-w�sa6~���RfQ���&ҙ��h�H8�)�o���	��l�H��D���CXlb�+���^�����z�Y�r�] ���_��ޯ>��JV�h~�澥���/��R¯>:��3����^Ht�%����Oݡ(2�D*�f�+�͎�Q!lI���uRvR.���^)k�@>�U�����Nٴ��h�-�T����_�l��1�èI���8�?�B���#�s�� b�*@-Ք���چ\8 ���`͆�Qb��\��io?g�Ð(���I$��n	&
�d�N����~�y+{��\�n�i��r��k��x���Ll���kzD�H=\3ɚ�\W/� ��0$����j#*����eCT!N�\Yǂ
��KH�T��z����Z�V��귐}���M����m粷�oG��Ł�R���onG?-��R%�f�I��+��u�%5�~���X���o��J5��5�[��n*S��~-Eau�9��"��Z��Ȅ����ߗ��0�]@uAԗp�ݚb_�H�7e��fE��26iV�s��Qi|���a�9kE-��BX&�3wk��)!��ww��؊	XaS�m?��T+�����!��"� e�Z�����0cA�6T	��Zs� #
�ΉSL/s���-߭S� ��t	@�px���hu��J��V���ռ����r�������s��i���J+�ȪF����]�1��Ì�3�?�I��'�f\�k_@�XevY�>�Yrl�pu�69#!�	����a���|���W�R���ܢ{�g�k%A��ג0WM)gT�"��p�pr��b=7"�L�?��˚1!Ck�Eps8~���to�1�`� 
H���T��v�O���A�rO����K5��wJ�ҵ1~ȲC�Tߎ�H��=�=�%�0�)RϢ�;*%�iGzg�4M�mu����F��"��spB�I��f�.�OtHb�����+E��_����W_��5      �   �  x�UUM��6=K�bn����`�C�\�i��9��Y��gM�
?T���o$9v�]�4����fS���yS���B�ɘ�@�k\��$67��l�m.���(�&�$�����=qG9D��dyy���{�D�������p��%���O���Z���fMw.����,���r�ӈ$Y4O
��M-}�yQ�8��>[5�%G$�t����ێ��$����6[�fS���q�!��
Sb55r���葟�9IZr�grޠ"��C#k��>DNT2e��32�=7w�	(zVX�Jʡ�߹D�^{�����f�����9�$����L�-g�L�HhP(pw6zE;P	i��{�!��F�lBW�"��\`u�/�v�ؽǱD�����0��� #��s���$�����{�(j�@���QbM��<j�7]@]��Vo�.bl�Kd�P�� ��1�.P
4�~�FV�C�w�`V��y�K���D�ʘ�!ik�X��
n̈h���V�*��)��y��fQ�T6-��\�~���.o*�$�NH���`���A|s;����*�xa T�n��A$��>�[�_V�/U.a�E?�WX��I5�����uBA�ǹ	v�)06�9�oQ6��z�Z9u�\�bd�gP�|�A�_����E���2O�e޹��\P�X[����X'$��zm�	�M&TPyV���w���~�'DS��qS�����X����S��T��N7�mu8�5��f�:T����txρ���zƄ4=q�Τz���k�uמ.��U��[���+_�z� %����.���e��;�������O{:m�����^����;�e|������i����M���ЫO��v����O�
�.��M�ӹ~����l�\��ۺ���?E+      �     x����N�0���S�V��״��6�p��t͔fR����iG��*|�����(��w�n�	�O.��
mmir�R�AI�C�RG����D���uWN��G�.� r!7y���������
a�-V"&@ip���� ~kf���>��<���k��Ǚh��T+��V�*�1	(���6���w���%O4����i���%��+QL�R��	S�W������/P(�Ҧ���SM���3�]�1�.���~�Uy[�+�L��X����1��5��      �     x�e�ɒ�0���)|�h-�d�4���Y����26x�6�V��1Kf�DRu�J��_7܍����QY&��E��a�Ɠi��vپ�o���m�����r��nG���"�I6u�(� �߹��s�!&5���1�j� ���%VV%DM\��c���;(�;�UT�<����G��@�i� |Ԩ?ӬN��d�����E��g����o�0t�&?*-��pT/�S�m[@N��<������1����$d`�y��jBC1tH��F�	��Q1���9��������M�8�;?sK���2�d6����{��ź1D2/�@س�*f A`�g�d.(|q������{���^䪺I4�0�|�5$���j)S�V�sm 9�w�<�y(D����I�fF�>C�!�P�"wgGk�e]>���M��K�+���'���E*��R*+��S�������r{��VM=:y^���h�̨�_�����9N
�H�M./ˉe
y�G�r*���\�T* VN��      �   �  x���ˎ�@��u�.\��Z;mP�PG�`zS �jn*Պ�~�l��Ifթ]՟�/'��.��E�Ɓ^s����tk\����<;7��^�ę���%����z�%z��_�LIG��L>�x� ��@�&��:8�SL��Ӫ��Z���	�3�c{\�#.�Թ�������';�<*��*��b�9��J��]⒢���ɓ�Ȃ(A����\�⻂VIP�?Sh8�n#�-("D_�h�����A�<G贅i��[�P�_ٗm��E�9����ػ(�������
��c¾�[s/͉�<�����A�چ� �B��!N
��~R|(x������I��;�ĲD{�V��_F��9�*0��C��߷S�.ښ�d?0{v�zNJ�{�.�ϩ)�e�ؼ��9ʮ�Ҩ�o,�0 d�"     