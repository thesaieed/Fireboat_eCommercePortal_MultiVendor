PGDMP                         {         	   eCommerce    15.2    15.2 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
          public          postgres    false    225            �            1259    107413    orders    TABLE     $  CREATE TABLE public.orders (
    id integer NOT NULL,
    created_at timestamp without time zone DEFAULT '2023-07-15 12:41:19.408755'::timestamp without time zone,
    modified_at timestamp without time zone DEFAULT '2023-07-15 12:41:19.408755'::timestamp without time zone,
    user_id integer,
    amount real,
    transaction_id character varying,
    payment_status character varying,
    payment_details_id integer,
    product_id integer,
    quantity integer,
    order_id character varying,
    vendor_id integer,
    address_id integer
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
    isactive boolean DEFAULT true
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
    public          postgres    false    222   �       �          0    107153    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   Q�       �          0    107160 
   categories 
   TABLE DATA           R   COPY public.categories (id, name, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    216   ��       �          0    107168    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   ��       �          0    107216    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    224   &�       �          0    107413    orders 
   TABLE DATA           �   COPY public.orders (id, created_at, modified_at, user_id, amount, transaction_id, payment_status, payment_details_id, product_id, quantity, order_id, vendor_id, address_id) FROM stdin;
    public          postgres    false    235   M�       �          0    107430    payments 
   TABLE DATA           �   COPY public.payments (id, amount, status, created_at, modified_at, transaction_id, product_info, mihpayid, mode, order_id) FROM stdin;
    public          postgres    false    237   �       �          0    107196    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id, avg_rating) FROM stdin;
    public          postgres    false    220   ò       �          0    107220    reviews 
   TABLE DATA           J   COPY public.reviews (id, product_id, user_id, rating, review) FROM stdin;
    public          postgres    false    226   h�       �          0    107226    shippingaddress 
   TABLE DATA           �   COPY public.shippingaddress (id, user_id, full_name, country, phone_number, pincode, house_no_company, area_street_village, landmark, town_city, state, created_at, modified_at) FROM stdin;
    public          postgres    false    228   ��       �          0    107234    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified, isactive) FROM stdin;
    public          postgres    false    230   ��       �          0    107243    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    232   �      �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 210, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 116, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Products_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Products_id_seq"', 105, true);
          public          postgres    false    221            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 35, true);
          public          postgres    false    223            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."newVendorsApprovalList_id_seq"', 22, true);
          public          postgres    false    225            �           0    0    orders_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.orders_id_seq', 158, true);
          public          postgres    false    234            �           0    0    payment_details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.payment_details_id_seq', 29, true);
          public          postgres    false    236            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 84, true);
          public          postgres    false    227            �           0    0    shippingaddress_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.shippingaddress_id_seq', 2, true);
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
       public            postgres    false    224                        2620    107314 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    240    216                       2620    107315 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    220    220    239                       2620    107316 !   reviews update_avg_rating_trigger    TRIGGER     �   CREATE TRIGGER update_avg_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();
 :   DROP TRIGGER update_avg_rating_trigger ON public.reviews;
       public          postgres    false    241    226            �           2620    107317    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    238    214                       2620    107318    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    216    238                       2620    107319    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    218    238                       2620    107428    orders update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 2   DROP TRIGGER update_modified_at ON public.orders;
       public          postgres    false    235    238            	           2620    107446    payments update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.payments;
       public          postgres    false    237    238                       2620    107323    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    238    220                       2620    107324    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    238    230                       2620    107325     brands update_modified_at_column    TRIGGER     �   CREATE TRIGGER update_modified_at_column BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at_column ON public.brands;
       public          postgres    false    222    238            �           2606    107326    products brand_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT brand_id;
       public          postgres    false    222    3290    220            �           2606    107331    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    220    216    3277            �           2606    107336    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    218    220    3282            �           2606    107356    reviews productID    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "productID" FOREIGN KEY (product_id) REFERENCES public.products(id) NOT VALID;
 =   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "productID";
       public          postgres    false    3288    220    226            �           2606    107366    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    3288    214    220            �           2606    107371 ,   shippingaddress shippingaddress_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shippingaddress
    ADD CONSTRAINT shippingaddress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 V   ALTER TABLE ONLY public.shippingaddress DROP CONSTRAINT shippingaddress_user_id_fkey;
       public          postgres    false    228    230    3307            �           2606    107376    reviews userId    FK CONSTRAINT     y   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "userId" FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 :   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "userId";
       public          postgres    false    226    3307    230            �           2606    107386    cart user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    230    214    3307            �           2606    107423    orders user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE SET NULL ON DELETE SET NULL;
 8   ALTER TABLE ONLY public.orders DROP CONSTRAINT user_id;
       public          postgres    false    3307    230    235            �           2606    107391    newvendorsapproval vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "vendorID";
       public          postgres    false    224    232    3311            �           2606    107396    products vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.products DROP CONSTRAINT "vendorID";
       public          postgres    false    3311    220    232            �           2606    107401    categories vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ?   ALTER TABLE ONLY public.categories DROP CONSTRAINT "vendorID";
       public          postgres    false    232    3311    216            �           2606    107406    brands vendorID    FK CONSTRAINT     ~   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ;   ALTER TABLE ONLY public.brands DROP CONSTRAINT "vendorID";
       public          postgres    false    232    222    3311            �   :  x���KO�0�ϛ_�;��w������)�1JS$��8��8U�|���#\��q`�+��Br�P$HKKf��B�"n�z���p���ϩy�.6�As"òz�8h�3���v��]9�.��hI�\��e�Ї|�
�֘�:X���g������g�y�FJƓF%ܕ��Ћ�>�FI{n\��Fx�֩y+���;JkQ�zD��Vpy���Q� ��N�15SnR[��fvݦ���y5�&�ʛ�;l���� X}캮.g��}J��y���ڷ��X�i�4�-��;��5s/�(�?���      �   =  x�}�ۑ�0E��(:���<�b���XT][�c{�}�\�1��#¢o��ċy!���?��-@r.� �	�(7_�T��6v:�G�`�\T��x@-��E��Jۂ�O���7����=��0���"1��I�ޯ�tM�=�vo7E0��yލ-g
�� W7�%|﯈M��m�$�R��;z���dRNK��<҂�ï��R*��>���Q��~~2k=�����#�*'�`�\�j��ح �����'��,߈�>tY\��Z1?
�U$���=�V�Ga�Q�z��^d�"�8O�L�2q��&I��Cc�?H���      �   �   x���Aj�0E��)r�}ɲ�f
��� ݤi(��$���C�tZh�h��g���iX�߮�����#�ZFF���4F߭ر���t=�b0�Ԁ���u�I��s�)�B��a�u�.�mR971�7���p�=D��cmL��񘊈Z�#�^e!�4]~�Q��,U���p/���n���h�x ���y��M�m�����uφP���	Т�J9�GT���T^mQ��H�A�F�ꛦ�u�n�      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �   �  x����R�L�������!w�*���D�AEA��>��C&�L���[���g:���RB#F�M�o*Q��Pb���1�H�%�e"��F_�<��ݛtH���N�<Z,���bߋ����+����)���=\�dE�r,����)WD���n:8��]7Gk�bD��j��ӂ]�4g��$8V��D���jk�����fu�
*�RE��_���q������g�����*��4T��uHk�bK�p�JkI����y�F_�6�+K7�-|ŧ���]U�ك��Q�Y�ey�H�el�&~��|������mx���[��ڸ�UC��>+E��ޥdW�XmC�W�§,V�%����]�No�M�Jf���^�}��}ݜ�.:�
\�diȢ�
X�H�����S�MU�zU)���"b\J��ӛګ�Ut\�*t2J塊M+���3Ŵ�dj���h�J��l�]��l�d\J�>~��M�.6��\��U���)pm�)����p�ܯ-��S��2��n��#�%ƛ��f'��*)�k嘼��O��3�(r���ݙ�f��q�8��+�-T]�bm��9%-<�1�:ߜ��̞4g����+H4���� b�M�������z�����R�I�L�9gԮ٧�U�7T��7caV�d�f�g���sS�}��xl��l�^^חU;o��[���NjN6��=�h5;=�YlL�p�O��yJ��ӌ�LB+��w��|\�r�UE�kJ��C{��J����6.�`�!=L"l�<P��T>L���[t3[�-��t���;��G�Z�I�ťV�+,V[0,��q�Uk���eX1.� ֐Z6��s����=�J��~���hw"��~��jGD���z���a���bxU1
v����*��0~e�Ͷ�c���gVp� ��Y��Z�.���u�y�q}=�w����}"L��yH�ah[�����eh��趛.��{�v8�lC4��A|f۝���������5G�*�������.mУ.M��	!ւ�Y�ìutxw|xt6[��{[���&Y��ʢ�H�>=��sC��A5����U���[P)�e�=���A���my-z�Q��T� -qm(L"ML8Ԭ;�3��=�:�K�j�r������e4�{T�-qk���0쪙rv���^T-t�e�~/`��b���~_d�{xQ�Ǯ��;["�$���f`�j|K��'oGrpL�=k���f�ԷT��{�׆gK�S���°����loK�SX-��e["�B�ź���Ȕ���u��qW�����zo�g��yQb|g�����7W����Ń2�Qz[2k������ŵ�����(1��.E�*t�w�;qP.�Ү�K�\�cy��5�������펾����$+�^��i�>��>S��b��B{���M�%ߡ��ݛ8���;8��A'\$T��$2�݊s(��{�m�NO�nf[­�cs�gz��,��ۍ�P�n���Ų<`e��
X�b(׵׎["�B��1
v����/��E�JZ��_չ|��j�w�/�$�K���}�:�E���H��庅�qK�f�b��a�����\��(�����0X���7F0��(���~Q�k5d�_tẌ́�[m���"��ã�Ӓ�����:�\���rK�U�;<�kw��/>88�ػg�      �   �  x����r�:���fʺK�����:�@���8���X�s
���hGտ�W�V��v��l�q	�������/�q�S(���Sk�H�~����B�DQ�)�G�?�t8���R��Ĝ�w��z����Y�U����l����˩��gUn�@sĈ[;v5�8��)����j�o�cu=�&�FL- F"s,��&���tL�E�D�k ���NGT�z��*;X�I�z��2��&�N�8������{�d����M= F���=���z�T�D	���%��y١s�H[;���Z��:$3㐒��]���>�R�z�a���7�į)@��ײ��_��Q$�@�0��lN�}�G5����A���4<��e�!#L�!�!M��T�Q��1v��z�P�h�"#L�!/�4�x�awe Ze7W�b���3N�!���1��CU�kQ�FV�SaXi*tqiݠ�Zg��M�B���T��&~;�����P�����X�?J�"#,쟺���5^�]�p����3�M�)A��@���\��K࿤��"����a�1�w���kb���$�{鄶�(�Jn������D�����3?9᷺�����o�^m���Q9bD�'��q���n�@�����h�O��ŭ2�����;@�z��������iV�����s�X�C$LV�!֐7�yDۢ={2�-dѬQ��jS�h���:6���G��]���EE��n���;�$���Ĉ0�O�U�=�a�[�D1GF���_W%˖j2D����㒶���,_F��p6Ed���z�;����#b������<������)��J<�h���@���o��t�^5��(��8\�c;�7��QQ�}���"�cUi ��dŸ)F�]��QI��?����H/�{m��"	����^��e	���d�ߟ��I�dr      �      x����r#G�&xM=Et�V�i �L�S��$�d�D�T*Y��M 	 ��L(3A��fz���9�s3k�{��s5��� �����GDFdIGc#SU�@f�z������OA���:��8XӨتq�f�"T7�f�T�Avf�&L�g��`�q�Z��OQ���Vu�>�aV��4����>,�	� }�j�f�h�a���n�$��e4�Qcgт�.���|MCu�҃����I�N�,V��f8���S&�n�ﾍ�������^d�,��� ��̤j�|RO���,J7���N�������A�WO��h��^����F%E�#�E�%���^��j��M���)M+/�dd3�G�C���}�h��-^6�O��<���5��,sZ��$}T�u<�6�����I����<��jX����8�c�[MӘ��c+�:��h#�]>EZi�%Z$�}R�`Aͯ��PE�
�<��x�٩��N�T���/����N����~��*J"<�߾��ӆ�Նf�Bn�1��(Y�-β�Hs55��Xgi��u�Y�҇IZ�y�۷��z�o�pmV�������8-���%MHm���&h޼�w�(���T��"]���B(�vE�&[�AڍM���t�h��`�ES�o�y@�
����J?������[S� K�c��y"�v����Z}گMB������Y��� �_�鷙z����>�y��Z������Jh��!(��
L����8�� W�F��L�f�R/�4���]��U�YM����IX��h,1�����W�Ђ��Gm�"��� �&�n����)�'D�x2H��0��٘^x����Չ�����5^����z�f4��7�,ۀ��=�	�C��ت���^6�L�Fc�<�t�)�XM#�ʺ�g�����O�1	֘�������R�,]��ψ1I3*_�A�l�K�pO�9�{:�JMR�'4>��i</Y���L� yٲ��eLG�N7H�b��3��x�`*xH�Y���X=�Y��j�omr:���"�lGqQ�or^�\�\�[jdUS�a��-Ma�LV��"Mg�W�O`��<��f��7�h5vN�艘\�;畖��1c�H��{I�I[��)?u+�����8(�k�a�ƒ���i��iF�,�Q�L�<N"w�k���<��RZ͜(�ƚ��fO7q@�
�p
�Fo�t�M�vG�Nֿ�B��ޜ��"po�b_�Dd9��-uG�g����z��,\PG�X۷ ���e�]�l]��u�B��nH�f��>���vd�#F;&b��h�׉�Ӂ}��1�D뚈1,߰��]5�a��H�z�1В�0x���k�,�	��ژ�x�jj�Jq�dmF��Y���2�N�K����J�h�%q�C؆!���*H.�j-�z��('�O���������pi���`�C���Ԩ���Q���J�ω����f�q�,��� �gw^Tf�z���g間�q�?oe8�M�և�sT�I��OӄxD���@��cp�������\sw: U���9��`�U��Q�t
r��|ëDX�t����TN��V[��4��}[:VK��:�D�Y>����B�8b.��O�4<�v���b�#9�{J�,h��#䎦�4�㐴�"�%ӽ��l����̆:/��DT�I��7$�_���<�����x*$��?��ZF񌾓'QV,g�VZ�:L���|� �1mZL�8�{��%�a�f���1��3b!���*D�[H�B�m���M�P��4]�R@/=��|�Z]"¤X
3	&$>����B����IF?��;�����9�~���������a����i��U�;������qb��_�?������N������7?i�8�.�2<�������������q@�E~ТFzͯ�������"����*=�f�o����ĊI���,�gF
Î�N�b�|���@a�g�1k�` � �E�j+�Y�ZZP%�pf����U���$�=1��d-~Z�_Fk�#����u�R����М�)泔�������*/@��O_n�8N_��d�m�2�7���Qr�~ݢ�}�5�SR\��̙��W$p��6fӾ���l+�(ҊoZ)9�(`��sK���������3#z=�X 7�m)G�oe@�п�+%�IAT��x{l^�Ǎ�f�+:����|��4��G����[|@s}����N�> ���R����dr����c�W���6�F���t;8;������tp�p��/{w���3�x�OQx~Е�288&qO�@�=%V��0M��(�c�ڣ� �n�:o��C����6�ىq�LJ$ݦ<{4B��l�+���|�$�!��"����oy��I��U]������y��xo�.|*6�V�d"ˏm	7�R �D6�Ҍ�̓Df�s��CR�1�^�v���0R*'Y��p�&�
Q`L���1���i��H2vl���T��3iIH��� �B+J�Ɍ{i,@Nl��71^mf^|�p�Lhy[V:�CH�I�fDq1�Xs�U����D;j����MZ1iH9�mFL�8���t�T^�xyg��t�UwK:0��۽F���/�)}���Y���N,��A����\�\_�Տ��.yMu3ͭK��:,�s���F����X0�,�&���Xm��)�c$HE�ã�4�i�������1�q���YDwH�
��R2t���މ�����5���4lҷ݆�u�+�o?w��-��o��]�磫��� 7 	�f�_ʳ��x~��w�y�^�\��I�g�-�q��Ė
�xx�����O׷�ɀI4����H?��+B��\F���͆�� ����&
�t��fu��z&%��t{��z���LOh�3�O��wM�da�@dX���G��^ǚ�:X�ؚ����y�=��15J/�c;��Z�cu��ǉ1���n-������Y�Y��45�f��Vb���f���Է��?)�-��[74�e�,�'���
AGE]��9�g��4�	��Jk{l�'��&�!�ϳ��%�:|⟵n�[�w�k�̴�m����њ��#)�+�Q����H�BZ�Bi3��&��]����4DGn@l�������������#;��Ǘ����d9ܛ7�R=�}ا��|d��1:{�pȴ{���c"�i
_6�ޘ�6uΧ~K�^{W�Z/��w�]�G$���ʈ���>��]�h�)}aU�os&��tox�<�W�}���7�{��L�L+a{3�k�;�,�#H���p?���<��]9����o���7B��P[w4D=d��Q�Uq�)	�=�Jg��8�d�S��&e�C�Is��KE��:�0@M���:�����.`X��k���K�T��D�.�Z��5��`���h��q�y4�L�IΧ��PQ@3t<I��I��a[җ�v��Lzs�^�a)�VF�A$�;f�$Q�i�$tNR�9����<���k4*ͮ���8J��Q���a�xc	�1!�y�gڙ�+T
��n�E����uH���2�p��K"�������F�#�/`�^\�v!���Ӌ�̜:_��2[hW��#	+Θ){��QļM̹���lf���e܈�*�X�]?���'p����:��p�Dq��h"]�.�}���8!0"�� �h6���pM%�a����ˊ*_�	��C�I�g��:�X>V��H��d�鯍f��&�!_u�~��5�DK�k����
�ϩd�<]���`ӜN���V���*�)�H�̡Vj�_y]Qj���������&&s\���^��dc�rmmp��V�WC��,\�����3�q�kw��Ϸ���G��k����q8rvt��㑴 ���_�x��A� -6�9J)Ã���M>�������i�؉�C�qPch}Y��-���5��}	��E�_�<8xA�!kq9"Q��uv����ȴ@�Ԏ{E�	��ۆYpeV�|��tżo84Fjˀ�}}�}��4:�f�k�
q=k�w��N�,��7�z��B[U�����D��tz    ���v������0�1V��~2#W���kb�9s�+��� �Nu{��BlB�����[���/�9	�S�k�����|n^���{*���z ��~��l�8u��8�q�bM�z��S.Õ�0�˒��.SKZ�,$�m���?s���Z�������c'�iM<ݢ�i��vm����6Q^�����	w��B��J�)���<"�ג{1ޜ�.��K�	V�Dy��s������=;;{9<�a'a�!�2K���Z��i�͊�O����Ql>�}Äy�!@mC��9n,���8��]����e1��T�B���Z�LA��7�XѮRDD��\=N�5{M�p�`��,?�]��[:�m�/<���U^��>���~����=�6;�>l�a�������9�D�rλ��w�$���q�+ϣijT�:�#�A�ֆ���`�k��d��ƌ��l)�!�9/�W�9�-?Q����:�7�^cՁ�8m�Ç ��%�M� 2!zl���X�Xk|�YA���]��9qh�?ݪu� �	����nxAl$H,�8���h��YL�,L��Ьɲ^��H�ΫM�w�u|˭8 ��9��<&����lW�8؟�X�olo�"��i�Öj=N?��	lf�>�0Hr���a;�!�]OvF��Ixa����Qr$P�pl�����n	�*��>�(j8爡i��^�!��ÉX�=��F�+����%�Em�b�u^R){g
D��Lr4���P���aw�iea)�V
',e�8���u�r�/�5�Bk]���zD��C���z�n�����U.X��N�E�E6�����/8D�(����1�I�������}ui ���F� ��p�j;\��\�`��^�D��ۏ�]o,{2���Z}����K�	�����
�[LLƗ��6	&0�F�B��C�qĂ��=���i!�V-��$����W�a�����.����.w,/�,��j�n`|i+��b�N��t&Qv�lR[H4k���7���4�C�-9��>6TGs�{�EUJ��j�n��Iu�1S�ov����>+:KIj���^haK�D;��ƞ�� ���ұt�jH���1k�k5:�n":�yj�r�q���Ʒ[���U�-�xa� �ϕ��c�XXσP���� ��b6²��:�iI�(�h��e��Q��E�`�$��
,b*��![,�:�D��GM�m �p�E����U�e����UKH��jM��f��k�҄�OHy��Ƃ�T�3�o�m�g��H�6�t7Y�L]�c���QX�>@�J�<�F)hz�39�g��'_VzB�����%����M/Nt�9>��J�c`Ii��+܍Y�.�{�i�wp� Y6�����U�E�.��n�I���#�Z=+�o���o7�V���]n�V��l�^��=�����ك�����[E������c���y����?�Ub?-$S��^�D_{��j�����)�Y�P�<bj��P�5��;ċ2 i.��RM�p��4��֗p�db�F``J���7-;��h��H븍��SUA:�X|�y��댕CL�`���&��8VS�vG�Po�`A�w d�h#����"�e/��5[����=8��Ջ:K���|�YΣ�4�^�Qgi�Zi�ߎ�w�?����N]�F��Ë1\��'_ø�R�F&�f�V���f�����p�4��X�9��s��<kš�f�ѫ��W�Nz��K�<O��q���ҁ������ٛ� <t`9��S�` t�+��A���*'�u��!���{d��W���w[���-�O�AsZA���/q��&Vǌu%%1��qxr]�E�{���P�QW�&E�}0xt,�'���pV���}����͘��i^R��doe+����rv@ء����c!��!Ze"�d�6�I�m�{hs��.�d�BP#P�YC���PL�֮3�T�>�w���O�����D+a�7�[:%'�
������v��'��JKp'1?�C��o���T�#��)�;�=���N�!)6����2��c�+�dI��}����Kj�lT-P�ȴ�9b����e�ńW�C����=F�>��F������Qd5�A��dF���g9Y�̳>�[��b��]>���]�l�F�+�Ej�l✨D�7X�fd4:~e�L�V�IԻ�z5b7VG{	j�o���g�O[�����.!�r���D�c+�����kީh�q�p6HɊ�G[���HW�\%HV��3#�������뤜��#�&1��}��uou�K���E�6\}W�Fz��i�	UKR㶆Ǒ}l@����A6��j��a��N%u��[g@�C���C�J�A��+^��a�l�~��m�{/�"~w@$H�EG�?=N..v�D����&kUP��d�d��b�8�����M����3�I�/o.n��W?�x�fW�j6z�v�mѷ��_�Z�g~Ǩ���
r�us$
�vB]�p�!ȶ%���S7�J�����eI����
��sѐp��&�T�F�܀�6��&�G�ë�*��F��
.�*ԴsStC�Es�^�p�[�s��ˋg�r�b��Ğ˿��_�*�9��0H�-�k�03��C��:m?�
f����҉͹b�i��k1��&vYâ�����UY;�:�[��~��V����^��~����?�_~<n	x��ȣ�wp�iQS��2��@��"s�}l����_�,����Z0�k@%������Q��t�u.�N�P���kƬ���^�l�Jv
Ro�c�,�saj�` �O�PL[�ٰ鉶�(�3۶$�X���E�pb�든`�;:~o�(�l�Y�>�xR��(�6�	c��uif������������c����<ఒ»wƋ �/C|n�*��_S�*B���N�/"�,���p+�I�����d��|�4��6�K��!dm��ܦ����;�������C�u���Q�d[&�1��)Tr@3x��k&3N�,���qK:�(�_%�-c�%�Ԏ9���
���8���Y�g�@sي;�^-�x���fK��A��óo��gh��'�4%�2�y����}��B��/I�A5��M�2Iۡe�a�5��e!`�K���
ɤ"�D���ɢ� �_5�`�ym�ec��࠽�䔁�`���8���L����u[-����鈴֗M��0�M�i�D�b�^"հ:��J]�(҉I��P�I�Y�]_ǎ�\�P+���>COθ��Ư�'$��B���V�#r��X�%V¨l@�<a�O���L4�3���^N�@Z�+D�hU�h�Ɨ,|ۂo��w�ڇ��7�����G���.޺fp֘��c�7�����>詍2QH���.�Sg��x�>�0���?G�>6�ς��������Z�m�7u����ߔ�Q�+K #mst%�'���YǪ0�q��Lx@�������&�F>e���h&hfVJ�)c�洝QVHX9X��l26��Ɓf?�p׼y����ڇm�1�{���a�^ �u�^�Ի����O����U=���݃�QF"�z}Z6�S�n����Y2v�{��ŗ��\J��r�JD�X�;�b��j����(�PCԇ4x|Xm���HG��)p#~tN�dO@���IJQ�ظ� ���h�(T<�w�Ix�C���66H傒���i�p��z���&��^������wp�^{0����2�������b�N����G����W�O�gR�嘤��Q�������[,����*uvc�_Nٔc�Mt�/`�O�JR�E¼���/��5 `�cQ�vu����/�. �q�(P��y�a�\ç���	b�f��ߪ&��'��΃���w:���h^M$����� ؄N$
j�UH��uR*�\�C�A�-',>���`4��������oL2�ֆ�觅E�qV���d�1#��_���y���;�/�@�q?���\��t� ���n測�����:�_����
���{>�ȓ�&�@G    ��!hU'�s�[d|���	�0�����ؕ{p
���]�����:������j7۝F����}��C�����ϧ��,�Bp\M����r�=�G�1�3֌S��Ő�LW~�Rh�}H�<ސn�s�z�1�)��N�l�
�͊e����B�R�H����9��F�l�C���:���t{-��h���l�p���y��ơ�_ĩ�0��cUN'�)t�kR����"���6�ϛ4�]F0!~ H��>��.Ȥ�D����ue^{4�AO<J���H��^ؒ�˃��7Lv�	�A���I�e��G��̘��H���OF��p��\�A7G��|�b��Q���Mh��hs��`�T�{�ñ8,����\W�I3�2��|��V�(�Vo���\��8T�!�y���D� ����s&ɟ2�Db��,���ZR���Ϩ��C�� l�*���G�;�F��
D���v:m���Cr;��<�Ps�w�>�#�e��M�����&AQ]��<#��I8%�"�O�8x��9�b�Qq�*oIE4t��O+�oL=]���t]-,u㠒�	;�Cb{���'5�?^��y�^_���>#C;�!Rχd��^=����������v��o�:U&�IO��ϑN$Pcx�a�n$n��EE�Ͽ��$���q"Z���х4jx�z���eF��
J�o��jK�h�����g���iM�a��I��fNQ%�	5�[���|fv57W��S_
*[����wYr�1;r� � Jjϭ��� ���A Z*�TRhM:-��+ҖH���l3E�O�+��a������^k�ٔ&l�$���3|p���oUdpG�
����b-�	�l
#9X|¯�d+SY��.�jگ��n5�^�+�G9��%O���D|����Rʼ�r>��*���p�1	יCZ�B/�D������]�"0FC
f�S$�-u�!N��`S�$卑BHbрz@����� ��4�X��.��&��G���$��C&��7�<��X,�.�/O�%/����dZ�q� 61$_M�n � ;����_����^W��ؒ��Y���Tqj�b_8�T���S��`ߙ�U��e9%Cq�P7t�sIc"M�:W�N��꜋���p��֪RM��K�,9��������J8���M2{^Cn!ա��g��n�����n$���R:]���z��ɻ�=�"����T5d����Cvkf��6��'6��j�^����r�V�sm&�I����B�ʺ�֯i������p��p|7VË�i4�m�������ht��?7w�ynґ��8�M.�*�A�m�c���ZsT�@8����m�h�4MD�'Y$Y5b�JBQ�#VZ���BN�Cm�н�>#$�E�)�`��7�㸼��pf�|=�1 �8n�@��ı���Xàm4�E��_^)3"A��r`g��M���Ʃ�ve��Zi�R	I�4	� ��T�u-��5���ʌ��`�M!E��Zx#������X�H�x"Ǥ�H�ʡ��#�qY,�5g)U��\Mì��M�(�?B��t;��e�l�j&��QB���=��{N|�Ő��0/����8|>^ ��ܔZN������hL���=��24f0��}��O�ζ���J�������4��,ݬ��Bq� yP#!!{���9�|p����k�����؝-�p�c~5��AM]G�]<�f[�������_ө��Ռ��J����=�T��?%�����7V��P�',��� w4������p�Ww^^��_�a��ڥ�o��}c8��$8zI}u�h�P��vs;�<�p���W?ǣ�q(�\��u��%SQk��Ij�jeUSֵL�af��C'�_Y$�7>��U�x� �}`dS�0|���C�X!�k����b����QW���x<��t�F����#]uR�54bX�+S�b_%� �����fe8B��ʪ`ͦ���:P����cu4ߩ��wg�I#�R����a�n(�G��Z�"�"h�-�\�k�+�\��F�fx�ި�(��K"g�����6'��/XJ�Do"�n��>��
b_� ����Ԃ�xm��ݱ�:�PU�W�N@vH��<���k�n@5��d�9e��a���f��咽�qɁ?��H/ ���ׁϬ�|1��F/p�V�V��U�up��!j7�k�M���\�8�[pu:��5��ڡވ>��"�J)?��W�
Hu���������H]]ߍ���i��{'�X����?WT��v.�XÆr�B����p7!'��H1�g�ጢ��$ۘ�(�e��Z�A{s���Q�<䕶���v��vxt1R��?�nMU[h��4�����C	���K�aQ-"�"�?f]^2��z��GJKR���li;��Q8��qt_7����WS�C�m5�[3N��.w��L�H�rMN��ݩ�?/��>Y��dAFJ"�Af�u���gmru�l&��ڿ�B~��@��xr��;!��RΡ�7L2��e���L��\���5��lV�D@s��ACp�X4�[ ǡ��ŇGvn��#w�_�//7��)'�O5g��v,#Y��4�*k������D�)���Ӂ�a�r���ה��h��/�u 9~��r��a
���&��XS(�������ib 2�2L.�C��������r�3tRCi�ET1�ӹ��]��F�"D8jS�-ɽ�zm�e�B�/_�P�S~��D�6��gt���w�^����^��y�A�����dp�m~���P�?�a��y��Ր��-뚟U�^�Y}7��"�C.���#d\�_��W�ߓ�'z~z��C�9>�P7���Ի�[ut�i|X	?�z�1c�_�b�8��1d�J�Ny+^3�}Zs\��E�t���%��t���k�(���^�Ԁ�k7��� /-T���"!�Ä�b&���"����멛�4��
�#������9-wvKȻ˗�]�_�1ƞ��Bv�(��t���D��nT�N�F�t�J��9�0^i����%jU
�0�~���h����#�����]ӥJp�NZ��� �V�:.�7�����Zf�:E�9�u"7g���ЁJɚ�j�� z+'�#�ȝ����;�
3N@R��b�b�o$�פ�V��8��ֲwT�wû��+X/��HI�n��W�h%_�H���B:Ƨ��"�|i�e�.o�(CF��7�{��߰�P�tY�{Z� q�;�r�@uHo7e<�n�!+�&UQ.u� ��,KTn�*��a�r�+̅�-�$�n���"Rt�6A5����I���$�~\���H��Lԏ�Ifn�<bs��E�M-�5y�i4�i�8�.�s��X��ҙ_ދbzl�/�.u`K���	Ɣ(�.����b���L?����(qX���bdJi��O]�5��Ϗ|��nYD[�`��<�P��a\�����EeQ�Yf��֥r.��i����r�ا�T]�*.�z����ie�ĢV�����2*��	E��'l��
�b��(|tg��N���RU�u�kR��k�T���Q�_Kp�<����i}N�}58���N��k���KA�A�9�[~�UOa��K�$��&���́.�\�j�m�`�L�TY���(�/a�e�XԂ)k��N�<:�5��6~���v��A70y�k;�Ց���Ă����ꮫ��+���S���3�c� /�Y�kk���v�\|k�jG�ڃV������C��4�v��r:Q������]|�\��_J'2�{�('H=�Ut�<-��"�_·����4r�#\l5G�w ���P'j�^S7�ۆ�5��e��^�o9L��tv��x=��8-r��GE��%O���۠�#s��A��b�[�'�5��?�M8� �j�'�6���zryT��F|M��R��=n��r��D}�$w3P�.����縎�)IQo��ή�i�٧x��e �C�+��-��S�q����{Yb���z�k������C�D��T%=��G��M��G>r����%迤P��0��:��Mⱂ���-"r��zBW�-Z��9ӑS��@��    ���^�J�˽�Y�22�7K�ړp��<a�v���,4TҩiR����Z.S.��TޘK7rޜ���N���1p�����K���u�,��Bg@�-�sH��5e�'8�Y���.2ѷ�`�@�E���R�2FVW�?"��n�����v�7
p<ܲ���ˆ�[�.nv'+8�g�79�����^9�_�& ��n��H��]���ݨ߻(}H�"��9 �8�v-���W��i�ɡ�8̾y��,#�h1P�h�_��\���������l��0�oxPL��ܮ��~� �l��g���=���W�������v�s���A�f����}��+u,����f��%U��O��,w�M��^��o5�Η���s^�ۮ?��/?;�g�A��g�k������]o�Ybe���;�q|y~wV"���U��y�\�Q��m��^)���A���F:�S�\SC*�z�K6*wM�����~_����N&[&�6Pd��U�����?����Û�L��]_���?~�W)��F��G���@��3bx&@�Q��V@f�
.��F
OY$���r+�h��
(s%n7��ԝ�R\S�L�М�C\�XC3�`���+�ˁ��ҙ0��2����.��U�vs,7��]��~�T���}�;nW�őho@��+z��n�o�Y�=�����x|M�.�P�Bt���ϊJ�<�I�r�D�3�桎��Z;f��O�ug�\g0o2�c6D1�p�nx<R��p?��O����*��կ ?�ӗut=�=Q��F�!N�s�ț�ҧ�&��qP�
�U�{d��$d8A�>��-��_71��k"�˓w2
�5S�.a��$Iwg�e��3)�� d�t����"�'o�_���Vo�9��\XY��.bn�%z�B};,������I�>ݏ��� SR�����K7���MB�p�sWrO4��a���'Dc�F�������5B�礞I���u�J�&��K!��fc/�"\�'�1cr�4Ls��;�CEb�i>V���&|aN1;I��K���U���������t�E	��;y���EO�i��7O�r��)�♳)RB���R�����}x�	�]�z��:ܘ�P���7kZV�v�;�T�Ñ��4�F�كϟA$�(GIm"���d�פ 6����4���/r㭳�A�R�7s�Z�v�lT3W�0 �p/w �gH�X����V�#hOW�S�����������\�a%׬{nbn?��um�[ƫzY�$ �U1N�?I�S��c�L���ȇ$�<�������#f�:ŵ]G��JAS��(���E+�-{�����F�0���^���N�s�c��#�(���mK��gP9�*x̜�yŲ�:�qe"5I�E!�I�c�Ռ���$��)J�89â̿tM�^95��]�)��=��oBC<��젘��v������/����A����z_����rÉ����j{5��cL�Su�:5�}��T���j�O�����k���1X0Pso���Q�oZ'�(��U`f�>�.pŷ�h`�f�{e)1�w��s�]��4�/,Jw�'rXn��JcTa���wӺuN^\���9������Z�LGD0����n����Ut5V����c�*+��%Ǵt^�����m�I���,�X���R�=�:�Zť~��^껢	�F�ծ�%�T��&��+�^oGÓO��Z}��Sv�.*S�CQČ#1.~Ԡ95��3�(ьc135�)�Im�B���q�<P�0�=��0Vw�nFcu�Nѐχ���ً��w����Sl�a��XF��X��J3S��m�љt"�D*#VHbÒ��w�������X�*�'Z ��jE��H�{�q�m�D��ˬ��E���B����n8'���8����Q�}�q��5"�$dk�@C84c} ��݋��N��B���w!�k|�������$��r������Җ˪��%08h�^��7;�F���u~v�������}���C�Yx����`���z�����觡��+ ��Z��R���uu1 Ô%Ihl���7�}����R�8ku�X�1��P0�JA��pfR	R�����+\~��Ӎ�'�Ҫt�^bK�̉B���З�ô4���^�/�t�VA��d�Uj���ѕV.�J���rhc$�F;Y���6���DSe#v6b�!V2�+���Hĝ g�Q�6��.�eC9~Vl\�;+�f��rem�\T!��N�4lh�.��m̶��UjH�f潷�dLS{��6�����e�$����Õv���0��@�4N�J������qB���f4i� ��D��*s����r�	�CΠ j�3��J`��sc�r����-�DA��,�y�~?Ȗ/%����Wn��t�Ȥ��=)Kc�{897���C=7��ӷM��4?&dH`m����Q��ҽ)M��t\:$0�
���������R��w�*�c����;��{}cD"�h_.�w	ע�5���+����Q!&�������{���w�f��!���F�u^>��=\���)x���V�� ���_�����-mg���T���J��.�A�J�B���׹򰛈uG��Ԃ¥��u�iX���L����@γ2��RQ�aY��4`��j��0M�������&��b�v��׻��c�������j��9�u�ߝ�x-lv�-��n�[9��Vn����]��"Ko��㻌��X��W���4�:�:��w��d��,s��h1[�H�Tji���ORb@Y0'�Z6y�J@k�qp7X`� po����ж����~�ё��FÕ7��r��骹�����t��l7�O��I�� I2��e&\|ޔ�b?/4x��V�����-�_��졪��4〧��p���H|���ϛ(�z��
�p��K�\��{Z0{�X��&�%��X��-�>�;�_�Z/-�ӣ��{��F�Mߣ�Hy�\F��ǋ�^��l~�k��������!����;�D���[R�6,����$ �^�3\6�������B�aN[��v��1����4qq88~ý"��K��z����8��"����*vͲ������l1y푁�����7�4�~�en�L�Ō�?��>>_���Y#�[��ښ;�Hժ��R��E�0sƬ:��oeX=�Ԋ���`v�k<���LCc��}FG��$�m�8���S�4E�!�VJ��^���4$��\�7�P�V�֓[����+E�� `P�`)�Յkr��(;ι/����q��J�mav�I�Zw鰖��0�ic�%H6j#�j����FGwu.�1��p�����gŲ!�u�u!��۶�2uQG�Y��@j��_^�t��ε�`@�|��k(oc�̗|��i��`�N�9�p�p�:�&ZP�p�^�)7�V������|�<8��ܾTݎr�, �>M���%��ꐍ��>:#]=���r�׌����X���^"�)g��,o4jȖy�"����R�sd�Z�JR�Z=Ͻ)��pe��ovZ^�����Oz?���X�.���8�DĈ�����1�\_9MJ�|�Nh�Y�6�w�Yq�f��6sǇV�Z��$����+�RxEGg�u�5����%~��2z
��dX��;	+�_�����_�a�}�a�z{I��?Q�9Tr_�y��(%�c8!S���\n�y𖤲F���ț�^�b3�=t���v��"})\���u�ܔY�+l��l{�T[U	@��R���� <]�ۤZ�=O��4=��&ye����Ԥ
@�;:��k�2�-��I���k|9���FE�R�r�\�P_��-��ŉoZW)ڽZo�٫���<�nr��eo��[nF�}�>�m�ڟ������p���xw���G�Je��<�[$a�>�:fQk�;�5^�,�PΒa��v�rU��Tj���j*�$�����śJ�e-,�\F��-��:y�]�J)Ow�%��4��Z����C.ŷ���f�Gˬ\��(6E��d�d���:��}�1xQ����,Js^a�
������,���s���<�7*���K&��{v�;��'g{I^a� �  �m��w����d�w��Yj�L�����dΙ{���-R���O��wwt���hpN��jg���.���k��f{V(����K�4���=�0�P*��x����Z5�,��
":���t��#-N�֟臣cW�ʥb�Z�l�p��"�$�Ķo��C�޾�%�k�d��U3לU\`VF����cus}��[6�3d1E=�[�y����Pk����dS�d=���h8�T���_��W�m��#&�]!d9����/��y�M?��P~Z��k��������n i���5�.�ۢ"�����QJ����T.���SҌ�U�7��e�)j�����[��qIhj�������يr[���8?�#�7�^�`�\��z>�ɂW$�����! ��Я���wF^0�ǍN��NmV�D'��D6��$[/��08��@2K�����jɰN��N���sN��Gא�Se�4f@"u�*�Ⱊ�k;�kf(�*A�ۂ�UB?���R��-/8;$��ؚz��I�)qxc�H�D�[A	 g"���]���^��c�܍C~�|����L.�v��2~>~�&?]v,�j>[@�}p�����x=�qE�	�f�T��y�����Q��$K���f�)���T�[w�N{]u�hiΥE�Zi��.��ȣ��w���0ͥ*�w*�_O�F\L��?��Q��&t1�\HԔY�@g�VXVl���s0��;_���g����Hy�̦2�,e�kp��f���0B ��Cx.v�pfPaB���!V`7�Tz����1��w�i��ښ�ڇÇ˄d�y"�����Y�>Ұ=2�\煚���+�n�je���Ͱ�҆X��>OŹ��>n�ϯp����혱��[yj/#�aS�s)&�W��,1(�j������xy��(���1A6��܅aP#����k^��_*�XG� ����47��r��\ލ�Ϯ�/�O?��9��ft{>�:	�b�I���P����ڻ�b�X�\S���ot���Y'�sJdb8r�n�u�x㇚@�ǑK�sq��kB��F�˦��.���㻪��8 ��e�S�#N�A4*�h�i.��;3p�����Z)0C$�e�� )/H�"�F��c��)�	N��i���� cs1������|�����8�>�N?$���������9������5ӫ U&����/CNM�Q�L�s5�B6��MU�8#u�s��1n��c�I��@v6��c�}��'پ�L%4H�c	GoLW��6a ��\W
�q��|���Դ�L4�N�F
P���$���[��bmu:��s�&�_����&)�?�?��M��˵t���]DD�R�HOgH�F�Y���!1��3T�>;R����>�=D2��/>�����wT���No�7g�w����p1<�= `��`�jȣu��-C�y�Z\�U�m�uw,�5Nʷ�Px\W�*{��YX�77�hݜ�¥����6~��>9D1���u$���1�P	XKsζw* �a���ti�k���D4+v��eߔ7w�v��E�gb����ϛД�
�濂5�+|��O�Xw;���p<�=����Aj�P>	 C��"g���8��:�0����=C<Ƞm�Hdj -؝�2e:|�Nj���=���s7�C�Tl��<��p79߱���,�8�pO!�;�F��1��#⋴��	 T
���DOԐ������&��hT�1�np�ZM^e8�!;�~��A(�@������DU���`�&_^����~X��pZ {4��h	MwS%9::!.��oIo���-�;A��� �6#�KK�1��?6Z�.^ ���}~��lCw�����x��N�����^����{�na�����/�'��/���-��W_}��He�      �   t  x�UUˎ�6<�_ѷ\a��c����%@�Y`�=m="e��"�|(��jJ^;��,����b{�mN�f��m��!ڑdJe��w\��$�6���l�m.���$�&�$w���=qO9D��lyy���E�����G���9K"�y2<�[I�N���ܹ؎�X�|�5p�ӄ"Y�N
��M}���H�cb��ƒ#
\z=����۞��,����6;�jSF�Cp�1� �)��9{IIt���$����Ƈ�7��q���Z��_#'*���^L�Ξ�{�=+-�%���\"Vo��APm��j+�($^�*9�ȳ&��[�����P��j���v0�@�%_�ZCpR4��sH�	]�d���sAԝ|8���=N%�'o6�����T�O���w�x����ϙ�h��(�Z�5W�(o���`����]�����6���@��3@.H
6�~�FU�C�w⽌-hV��{��!u�DϪ��Q!ik�x��ܘ	�� �m���j�%��{L�fQ��6��\����/o.�%�'�qW�0��Q�`��Κa�v��4] �j�u�� �0<�Q�2�A���-����2�H걎�����0͟*	v�)6��8BoQ5Ǡ~�[9�u.E11�3�>Ǡ�tއƂ`qj��I��;Wԛkk���au��d�Xo��:��̣*W'��~�]�C4�ӡ9m��#ws:5?���/�n�lw{]w��.4h��5���v����û�f�40&��V&m��j��ta�������x^��>�)9Lߟ��%OX\�@����=}���t��mv#uWr�+�^_G?M�1����� O�s�9��_,�� M1P�9>5��ڞ�����m6�� X'@�      �   �   x�}ν�0����*z�����Q]LX]N,?MhI@B�{%G����G�DŶ���p�!8��8W[�F-$hM�J�[z8e��L=\(��S�Jː�(P�*��Ryc��e�V�� 1m Pί����k�����ٺ��m�]tl����4Z;���K���;D�      �   �  x�e�Yo�:����E/]����$!�RR�,�4r��� a�Z�?I�s::cY�y%�{��F�u~?~��ȤG�|D��T"?�ڻ;��Ϣ��¼	�Uɖ�ff�|�X�=��K�K�z]X���0��	�'DZ�D1��a_��-��!2Ɛ*}���yP�d�<?�Z������_o�P{Q���).�0QvIw��7�b����c�lݺ��r_����REeߕпJ�Jx�[��f)^�V;�y��t�@����B5�.�T�o
?)��LU1"}�s��������g=���=���9*;#��N��Ư���txs�������[@X��O����h�U��|+���Jv�E����@]��(i��l�l�Q��4*��&��Τ��g[z��G}�j�����U��7)mab � �|I�c���x���!�t�p���8x���f>��2\���l1ո��q�9�	���"k�#pxy͂2�m���
�v|����|3�^e)p�h�M^�&F`��zu5��A�C�Y"��z
F㙓�p���½�6����X�Y��~�c�>Z5��~פ��k!�@��7gu��s zF��/�� �D�el��{�Ǫ�.Y?)�\$y�p�EJM"�꛶?<ݫ����Po�J�Be�4����J^��>�ll�C���E�=�m�s���[1�t����<�����?�"      �   �  x���Mo�0���9�8�`oi!��A���bނ!��h�}@��Nک���K��y�a8����cj.e(�5m��op�l�h]����/$pv��S��q��c���;�s202�O���z i�)��M�M�LS|LrL��yS�������e0�u�����;>H�j,B�L����Lw��;cr��*
�7� �$$l��g��е��BY���=���go�&�T��0qQ\�F4S��T���C�]�Ý�e�P��<3کH����@W�&	e�,��0I�S�E��g���?��~�~[�YbO5�f������菘d��.XތL��$�űX�����Z��W��c� �h��=i:B��{��*����\����VIkxA�%^��     