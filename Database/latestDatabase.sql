PGDMP     -    *                {         	   eCommerce    15.2    15.2 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    57901 	   eCommerce    DATABASE     ~   CREATE DATABASE "eCommerce" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE "eCommerce";
                postgres    false            �            1255    57902     main_update_modified_at_column()    FUNCTION     �   CREATE FUNCTION public.main_update_modified_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW; 
END;
$$;
 7   DROP FUNCTION public.main_update_modified_at_column();
       public          postgres    false            �            1255    90676    update_avg_rating()    FUNCTION     >  CREATE FUNCTION public.update_avg_rating() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
        UPDATE products SET avg_rating = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id) WHERE id = NEW.product_id;
    END IF;
    RETURN NEW;
END;
$$;
 *   DROP FUNCTION public.update_avg_rating();
       public          postgres    false            �            1255    57903    update_product_category()    FUNCTION     V  CREATE FUNCTION public.update_product_category() RETURNS trigger
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
       public          postgres    false            �            1255    57904    update_product_category_after()    FUNCTION     �  CREATE FUNCTION public.update_product_category_after() RETURNS trigger
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
       public          postgres    false            �            1259    57905    cart    TABLE       CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer DEFAULT '0'::numeric NOT NULL,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    57911    Cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Cart_id_seq";
       public          postgres    false    214            �           0    0    Cart_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public."Cart_id_seq" OWNED BY public.cart.id;
          public          postgres    false    215            �            1259    57912 
   categories    TABLE     �   CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    vendor_id integer
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    57919    Categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Categories_id_seq";
       public          postgres    false    216            �           0    0    Categories_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Categories_id_seq" OWNED BY public.categories.id;
          public          postgres    false    217            �            1259    57920    discount    TABLE     �   CREATE TABLE public.discount (
    id integer NOT NULL,
    name character varying,
    "desc" text,
    discount_percent real,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.discount;
       public         heap    postgres    false            �            1259    57927    Discount_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Discount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Discount_id_seq";
       public          postgres    false    218            �           0    0    Discount_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Discount_id_seq" OWNED BY public.discount.id;
          public          postgres    false    219            �            1259    57928    order_details    TABLE     �   CREATE TABLE public.order_details (
    id integer NOT NULL,
    user_id integer,
    total real,
    payment_id integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
 !   DROP TABLE public.order_details;
       public         heap    postgres    false            �            1259    57933    Order_Details_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Order_Details_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."Order_Details_id_seq";
       public          postgres    false    220            �           0    0    Order_Details_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."Order_Details_id_seq" OWNED BY public.order_details.id;
          public          postgres    false    221            �            1259    57934    order_items    TABLE     �   CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    57939    Order_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Order_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Order_items_id_seq";
       public          postgres    false    222            �           0    0    Order_items_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Order_items_id_seq" OWNED BY public.order_items.id;
          public          postgres    false    223            �            1259    57940    payment_details    TABLE     �   CREATE TABLE public.payment_details (
    id integer NOT NULL,
    order_id integer,
    amount real,
    status character varying,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public.payment_details;
       public         heap    postgres    false            �            1259    57947    Payment_Details_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Payment_Details_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."Payment_Details_id_seq";
       public          postgres    false    224            �           0    0    Payment_Details_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."Payment_Details_id_seq" OWNED BY public.payment_details.id;
          public          postgres    false    225            �            1259    57948    products    TABLE       CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying NOT NULL,
    description text,
    price real DEFAULT '0'::numeric,
    stock_available integer DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    discount_id integer DEFAULT '-1'::integer,
    category_id integer,
    image character varying,
    category character varying,
    brand_id integer,
    vendor_id integer,
    avg_rating real DEFAULT 0
);
    DROP TABLE public.products;
       public         heap    postgres    false            �            1259    57958    Products_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Products_id_seq";
       public          postgres    false    226            �           0    0    Products_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Products_id_seq" OWNED BY public.products.id;
          public          postgres    false    227            �            1259    66079    brands    TABLE     �   CREATE TABLE public.brands (
    id integer NOT NULL,
    brand character varying NOT NULL,
    created_at time with time zone DEFAULT now(),
    modified_at time with time zone DEFAULT now(),
    vendor_id integer
);
    DROP TABLE public.brands;
       public         heap    postgres    false            �            1259    66078    brands_id_seq    SEQUENCE     �   CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.brands_id_seq;
       public          postgres    false    231            �           0    0    brands_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;
          public          postgres    false    230            �            1259    66112    newvendorsapproval    TABLE     d   CREATE TABLE public.newvendorsapproval (
    id integer NOT NULL,
    vendor_id integer NOT NULL
);
 &   DROP TABLE public.newvendorsapproval;
       public         heap    postgres    false            �            1259    66111    newVendorsApprovalList_id_seq    SEQUENCE     �   CREATE SEQUENCE public."newVendorsApprovalList_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."newVendorsApprovalList_id_seq";
       public          postgres    false    235            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public."newVendorsApprovalList_id_seq" OWNED BY public.newvendorsapproval.id;
          public          postgres    false    234            �            1259    82463    reviews    TABLE     �   CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    rating real NOT NULL,
    review character varying
);
    DROP TABLE public.reviews;
       public         heap    postgres    false            �            1259    82462    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public          postgres    false    237            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public          postgres    false    236            �            1259    57959    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password text,
    phone numeric,
    address character varying,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    logged_in_tokens character varying[],
    isemailverified boolean DEFAULT false NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    57967    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    228            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    229            �            1259    66101    vendors    TABLE       CREATE TABLE public.vendors (
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
       public         heap    postgres    false            �            1259    66100    vendors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.vendors_id_seq;
       public          postgres    false    233            �           0    0    vendors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;
          public          postgres    false    232            �           2604    66082 	   brands id    DEFAULT     f   ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);
 8   ALTER TABLE public.brands ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    231    231            �           2604    57968    cart id    DEFAULT     d   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    57969    categories id    DEFAULT     p   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    57970    discount id    DEFAULT     l   ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public."Discount_id_seq"'::regclass);
 :   ALTER TABLE public.discount ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    66115    newvendorsapproval id    DEFAULT     �   ALTER TABLE ONLY public.newvendorsapproval ALTER COLUMN id SET DEFAULT nextval('public."newVendorsApprovalList_id_seq"'::regclass);
 D   ALTER TABLE public.newvendorsapproval ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    235    235            �           2604    57971    order_details id    DEFAULT     v   ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public."Order_Details_id_seq"'::regclass);
 ?   ALTER TABLE public.order_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    57972    order_items id    DEFAULT     r   ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public."Order_items_id_seq"'::regclass);
 =   ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    57973    payment_details id    DEFAULT     z   ALTER TABLE ONLY public.payment_details ALTER COLUMN id SET DEFAULT nextval('public."Payment_Details_id_seq"'::regclass);
 A   ALTER TABLE public.payment_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    57974    products id    DEFAULT     l   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    82466 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    236    237            �           2604    57975    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228            �           2604    66104 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232    233            �          0    66079    brands 
   TABLE DATA           O   COPY public.brands (id, brand, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    231   f�       �          0    57905    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   ��       �          0    57912 
   categories 
   TABLE DATA           R   COPY public.categories (id, name, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    216   :�       �          0    57920    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   q�       �          0    66112    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    235   ��       �          0    57928    order_details 
   TABLE DATA           `   COPY public.order_details (id, user_id, total, payment_id, created_at, modified_at) FROM stdin;
    public          postgres    false    220    �       �          0    57934    order_items 
   TABLE DATA           X   COPY public.order_items (id, order_id, product_id, created_at, modified_at) FROM stdin;
    public          postgres    false    222   =�       �          0    57940    payment_details 
   TABLE DATA           `   COPY public.payment_details (id, order_id, amount, status, created_at, modified_at) FROM stdin;
    public          postgres    false    224   Z�       �          0    57948    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id, avg_rating) FROM stdin;
    public          postgres    false    226   w�       �          0    82463    reviews 
   TABLE DATA           J   COPY public.reviews (id, product_id, user_id, rating, review) FROM stdin;
    public          postgres    false    237   ��       �          0    57959    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified) FROM stdin;
    public          postgres    false    228   �       �          0    66101    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    233   ��       �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 171, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 115, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Order_Details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Order_Details_id_seq"', 1, false);
          public          postgres    false    221            �           0    0    Order_items_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Order_items_id_seq"', 1, false);
          public          postgres    false    223            �           0    0    Payment_Details_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Payment_Details_id_seq"', 1, false);
          public          postgres    false    225            �           0    0    Products_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Products_id_seq"', 83, true);
          public          postgres    false    227            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 35, true);
          public          postgres    false    230            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."newVendorsApprovalList_id_seq"', 22, true);
          public          postgres    false    234            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 60, true);
          public          postgres    false    236            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 131, true);
          public          postgres    false    229            �           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 32, true);
          public          postgres    false    232            �           2606    66086    brands brands_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
       public            postgres    false    231            �           2606    57977    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    214            �           2606    57979    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    216            �           2606    57981    discount discount_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.discount DROP CONSTRAINT discount_pkey;
       public            postgres    false    218            �           2606    66117 .   newvendorsapproval newVendorsApprovalList_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "newVendorsApprovalList_pkey" PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "newVendorsApprovalList_pkey";
       public            postgres    false    235            �           2606    57983     order_details order_details_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.order_details DROP CONSTRAINT order_details_pkey;
       public            postgres    false    220            �           2606    57985    order_items order_items_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    222            �           2606    57987 $   payment_details payment_details_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT payment_details_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT payment_details_pkey;
       public            postgres    false    224            �           2606    57989    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    226            �           2606    82470    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public            postgres    false    237            �           2606    66099    brands unique_brand 
   CONSTRAINT     _   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT unique_brand UNIQUE (brand) INCLUDE (brand);
 =   ALTER TABLE ONLY public.brands DROP CONSTRAINT unique_brand;
       public            postgres    false    231            �           2606    57991    categories unique_category 
   CONSTRAINT     U   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_category UNIQUE (name);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT unique_category;
       public            postgres    false    216            �           2606    57993    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public            postgres    false    228            �           2606    66147     newvendorsapproval unique_vendor 
   CONSTRAINT     t   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT unique_vendor UNIQUE (vendor_id) INCLUDE (vendor_id);
 J   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT unique_vendor;
       public            postgres    false    235            �           2606    66132    vendors unique_vendor_email 
   CONSTRAINT     g   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT unique_vendor_email UNIQUE (email) INCLUDE (email);
 E   ALTER TABLE ONLY public.vendors DROP CONSTRAINT unique_vendor_email;
       public            postgres    false    233            �           2606    57995    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    228            �           2606    66110    vendors vendors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.vendors DROP CONSTRAINT vendors_pkey;
       public            postgres    false    233            �           1259    66095    fki_brand_id    INDEX     E   CREATE INDEX fki_brand_id ON public.products USING btree (brand_id);
     DROP INDEX public.fki_brand_id;
       public            postgres    false    226            �           1259    74275    fki_c    INDEX     A   CREATE INDEX fki_c ON public.categories USING btree (vendor_id);
    DROP INDEX public.fki_c;
       public            postgres    false    216            �           1259    57996    fki_category_id    INDEX     B   CREATE INDEX fki_category_id ON public.products USING btree (id);
 #   DROP INDEX public.fki_category_id;
       public            postgres    false    226            �           1259    57997    fki_d    INDEX     8   CREATE INDEX fki_d ON public.products USING btree (id);
    DROP INDEX public.fki_d;
       public            postgres    false    226            �           1259    57998    fki_discount_id    INDEX     K   CREATE INDEX fki_discount_id ON public.products USING btree (discount_id);
 #   DROP INDEX public.fki_discount_id;
       public            postgres    false    226            �           1259    57999    fki_order_id    INDEX     H   CREATE INDEX fki_order_id ON public.order_items USING btree (order_id);
     DROP INDEX public.fki_order_id;
       public            postgres    false    222            �           1259    58000    fki_payment_id    INDEX     N   CREATE INDEX fki_payment_id ON public.order_details USING btree (payment_id);
 "   DROP INDEX public.fki_payment_id;
       public            postgres    false    220            �           1259    82482    fki_productID    INDEX     I   CREATE INDEX "fki_productID" ON public.reviews USING btree (product_id);
 #   DROP INDEX public."fki_productID";
       public            postgres    false    237            �           1259    58001    fki_product_id    INDEX     E   CREATE INDEX fki_product_id ON public.cart USING btree (product_id);
 "   DROP INDEX public.fki_product_id;
       public            postgres    false    214            �           1259    82476 
   fki_userId    INDEX     C   CREATE INDEX "fki_userId" ON public.reviews USING btree (user_id);
     DROP INDEX public."fki_userId";
       public            postgres    false    237            �           1259    58002    fki_user_id    INDEX     ?   CREATE INDEX fki_user_id ON public.cart USING btree (user_id);
    DROP INDEX public.fki_user_id;
       public            postgres    false    214            �           1259    66123    fki_vendorID    INDEX     R   CREATE INDEX "fki_vendorID" ON public.newvendorsapproval USING btree (vendor_id);
 "   DROP INDEX public."fki_vendorID";
       public            postgres    false    235                       2620    58003 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    216    240                       2620    58004 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    226    239    226                       2620    90678    products update_avgRating    TRIGGER     �   CREATE TRIGGER "update_avgRating" AFTER INSERT OR DELETE OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();
 4   DROP TRIGGER "update_avgRating" ON public.products;
       public          postgres    false    226    241                       2620    90677 !   reviews update_avg_rating_trigger    TRIGGER     �   CREATE TRIGGER update_avg_rating_trigger AFTER INSERT OR DELETE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();
 :   DROP TRIGGER update_avg_rating_trigger ON public.reviews;
       public          postgres    false    237    241                       2620    58005    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    214    238                       2620    58006    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    216    238                       2620    58007    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    238    218            	           2620    58008     order_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at ON public.order_details;
       public          postgres    false    220    238            
           2620    58009    order_items update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 7   DROP TRIGGER update_modified_at ON public.order_items;
       public          postgres    false    222    238                       2620    58010 "   payment_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payment_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 ;   DROP TRIGGER update_modified_at ON public.payment_details;
       public          postgres    false    224    238                       2620    58011    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    226    238                       2620    58012    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    228    238                       2620    66089     brands update_modified_at_column    TRIGGER     �   CREATE TRIGGER update_modified_at_column BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at_column ON public.brands;
       public          postgres    false    231    238            �           2606    66090    products brand_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT brand_id;
       public          postgres    false    3301    231    226            �           2606    58013    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    216    226    3276            �           2606    58018    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    226    3281    218            �           2606    58023    order_items order_id    FK CONSTRAINT     |   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 >   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_id;
       public          postgres    false    222    220    3284            �           2606    58028    payment_details order_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 B   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT order_id;
       public          postgres    false    224    220    3284            �           2606    58033    order_details payment_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT payment_id FOREIGN KEY (payment_id) REFERENCES public.payment_details(id);
 B   ALTER TABLE ONLY public.order_details DROP CONSTRAINT payment_id;
       public          postgres    false    224    3289    220                       2606    82477    reviews productID    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "productID" FOREIGN KEY (product_id) REFERENCES public.products(id) NOT VALID;
 =   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "productID";
       public          postgres    false    237    3295    226            �           2606    58038    order_items product_id    FK CONSTRAINT     {   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id);
 @   ALTER TABLE ONLY public.order_items DROP CONSTRAINT product_id;
       public          postgres    false    226    3295    222            �           2606    58043    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    214    226    3295                       2606    82471    reviews userId    FK CONSTRAINT     y   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "userId" FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 :   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "userId";
       public          postgres    false    237    3299    228            �           2606    58053    order_details user_id    FK CONSTRAINT     t   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 ?   ALTER TABLE ONLY public.order_details DROP CONSTRAINT user_id;
       public          postgres    false    228    220    3299            �           2606    66139    cart user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    214    228    3299                       2606    66118    newvendorsapproval vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "vendorID";
       public          postgres    false    3307    233    235                        2606    66124    products vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.products DROP CONSTRAINT "vendorID";
       public          postgres    false    3307    233    226            �           2606    74270    categories vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ?   ALTER TABLE ONLY public.categories DROP CONSTRAINT "vendorID";
       public          postgres    false    233    216    3307                       2606    74276    brands vendorID    FK CONSTRAINT     ~   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ;   ALTER TABLE ONLY public.brands DROP CONSTRAINT "vendorID";
       public          postgres    false    231    3307    233            �   :  x���KO�0�ϛ_�;��w������)�1JS$��8��8U�|���#\��q`�+��Br�P$HKKf��B�"n�z���p���ϩy�.6�As"òz�8h�3���v��]9�.��hI�\��e�Ї|�
�֘�:X���g������g�y�FJƓF%ܕ��Ћ�>�FI{n\��Fx�֩y+���;JkQ�zD��Vpy���Q� ��N�15SnR[��fvݦ���y5�&�ʛ�;l���� X}캮.g��}J��y���ڷ��X�i�4�-��;��5s/�(�?���      �   z  x�}�ۑ�@D��(��)��0���㸌]�k�.}7s�V#hm�[n؄E��y"����H;\6�mu&O��E^�7��5j�k#�����rI�Ә*�ބ���"l�4L���7ɏ�:d�F�[�o�`��T�и��>l��NU��&�|�] g������COlʘ$�;Ic� ޒ���O��|��S!�专��/��&�HwR'⅀�#і�,˫�����th��z;����Vp�D3��D��rBV�ܾ�(��5j6�)P�;x�W�W���q,�$�RֽW����J�KRK�/����K^��J�z#5`��
���Y�F�\����UN���q�oR�%uZ��8�n��������K      �   '  x���Mj�0F��)|����F�5�B7���MMb�C�_�4u�LAx3㧙�ܦ;~t�# ^���[�,����E�ߥ�"k�j	�G� �06Ln�ލ����(+yV@�%D(S��/C���`($o���ܺ{�液�eLY�W�Y ����~��q�ϓT�3����Gf�qic����TDȨ�> M�vO��Z��G�p��H���-X4Z  $w�v�ܧmɒ��@����z��%��ì��"��Ǡh�(c9�T��%��T����Կ��FH�(>Q���qAQ���I+��7M�	�"�K      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �      x������ � �      �      x������ � �      �      x������ � �      �      x��}�r�F���iOL�j�d�?��J�~\��(��1��h �Ċ��Ll����^l���^��<J��>��D������Ѷ%H$2O�������$I����^�`k5*�,��U����y�=���
�3�b�1�(Z,c�OQ���Z��j?}V��P7i�ߩ�CX�f@��j�fj�a�~HWY��<�Ni���n�����lMBu�ҍ�x�j&�:��Xݥ��`���Ma��}����}��/�����>��T�=g>��N�!��^�!Ȣt����$�i��_~�����|��:�:�۫�T��̣�y�ӈ^��+*��ⵚEE��z]-�pB��A2��ʣϡZ�݊��h��-^6'�"��/��;*xcL_���-�铚����l��y��q�+O��~��5���'����&iL��m�:��h#j�(��1�4�%�O��EHÏ�{~<�**T�)>��:���Yv��ڴ<]Y��ww��4��`�Q���>JhOkj�+��y��OYTD�}9�4����&Y��,-�b�y!�S�c�a^������,\D���|��� N�fND�X��p��ݼ�7�(���?�,Z�E�ԫ��PtuA��k5AڍM�y��<����,��|��"�E���[�T���z������A��� [��"�E��Jkti�V	�Ғv*�ed!�_�H��ߦ�)*��I7��h��ՒO�_k��UB_��*���ѧ�	��<�U��ٸ���H�-�4���]��U�Z�����qX��h.1�����W�Ђ�Em�}$�A�}l�����>�!!ƝA�?��ƞ��'��A�H�:r�]�X~�F�|�Z.ӌ���U0�V�5WDt���>6�q���-�Wc�>a��'�XM#�ʺ�f4����O�1	V��9>+3T"�KͲtA;?%�$è|���K,,Mf�o�͙<�j�=a��1L��y�Je�y:�˖E�}�(c:bt
x@�.&�)8S���aF���4�������%=����*�C9|.���vU�����*_� ��z�eni
�dE�ߧ�T��J�	L���=^-���&���i>��Av��Ҳ�f�gi0�tω<i�1��a�1�����p-b<���X��c>��<͈�Sz7�7ϓȝ��`Bt�V�)�fNFcI{C_OVq@�
�p�FO�t�U�vG�Nֿ�B���#po�b_�Dd9��5��F�hg��$WYxO/ʬ��ھI��,�ݼd�������gCZ�0����<mGF?b�#"�j��x�x�>�g,��sN�����Zj�V��ty���wj=-	�W[����𾰏󰠍�����F�GN�f�.	�e�M�Cz���"C�մPiMqB�$s�0$��T��\���{z���f��֧F��C��K�r��V�|0��k}j�=͟�Q���J/�]��Jd���ar�<3Io�q�Ee�����n9�A����g�	4��~�
���`�4!A��DD'��19�������\sw: U����9�����0ף���`�2ʘ��J�|3oe��&[m���hV�]��X���h,g����A�t`���{`>q�����\������S*gA+7ǘ!�h"J�0Ik+Z2��w�-�_��YS����3�=�B	�י�<�h'�93���o��ͣxJ���q��i���N��*1=��6-&s�����4H�]�ޘ��L�[p"�5�J��6���*���p�.h)���CE�F��0)��L�1�O���P/���8������^o�����~�Z�������F�N
F�o5{_�T���zw��81������n��mu��Y�z�����c�wV����ߏμf�������{dS�{z��W����;��"$CZ�m��T]f�ABK����(�]��$���KR�z��"X�՛ �TG=޽~����ƈ�߰�d�L�k�5��z�o��h��̃�Hy�b���*]�Z��}Դ��JE��U��ثT�j(�3D5�4��8���ܞ�Sc^O���K��������Ԑ���xj����`3V]X���䬧�yh���{���5ɒ��mZ��(|t�(�J�#��b��I�|�
�ڌ��a�Ij- i��4I>?����~c�b�^N!3��(��T=@���ɷڢ���V���g�Ա�9��5#�EA'�_ʛ�r�
�49�l/jƂ�C���Z����ƣ�6�X&���;���)��b!�t_5N�ę�܇~��|����o��F�_o�Z�z��}���G�׮���N�����s��=�z�=�{~�N���;�<U��a����E�������HoyX�eR���EKu�*����B��}�ʉ#��N#$��~��(�,�&P m�V��	y8��z�Tя�iҀ����@lo5�nl2[;��G��˴'$�I?�D��{��=L��M����ƣ�PڷƧ��0�ӧ7<3�v6���-in�$������]d�����0�^9�f�����M��A�71�"��f�R[���5�oK�����uh��3z���m)g��dBO��I~��Dz�50]����n\3�x���ӈt40�vP�a�=���G��X��DԵ�� ���hU����~���{5�K�͈�v���%���k^�ѭwphG���I(���V[^vty��5�;�cB���E��X�@@��	q���^�T�~�"��8	�;W�c����I�jH{2]��F�@�D�RAA:�0YB����x��S��ir�T\B��f�f��e=�,����f�,d-��W�&|.VFtѫ��VxO��C��J�8��_'�)�EF�N����}J5�{�!.1]��d��h��X����$]�Ud�S�3,a������m|�V�������uH�d�����jzϋ�<��Z���L+������y1G�(�I�HB�{�D
;�?����}ZqT����uҿ�f��к��}b߭^��"%���(���t�^˯Wᓬ-M�M!M:���#��3�b���&��~>V�y��&�`䯶��VA)���()�>!�
��j�u�&S�-��c��q ��}Z��,�%�Sz$(��^��ר��n�ѭ�k���m���k��j�|�Q��}����m@���q�ꥣĞgĞ�N�����1�ҋ�+�i�콤%<0N]�z@L��r�N���t����uET�
�":�LLd�m>+DA�l��������W� ��U��uZ�*sg��:�C;B m�&��LB.��]�N�(LͧW�mb|�
	��}5JgEE}b�Fj*�SKSÏg���C�7�:�\���������٠�!�I!ہ����.Ȍ�Kl�+(�d.�k�kb3:Np�[���L�R�G>�ﴃϾa�~��5�h�00���cz���^�Oo�����a_��#<yzb��-����F�b{�^Kw���CKz�z~dÎ��i�p�,8�4�w�ݿ��fH�{�"�V*�b���
3-v��/$���4b>�_s6�~�]�jx=����+�B�su�������)�"0`#�T����-�p��@�$�E˥�I�A�g� �>���=C�N�W(b��*v�{48b
Q�OGD"�5	�"�E!���l�g8�Rv���Wv��2�x��IN�v2N�R�X{h��n�oG7�C�=���uO 406�[�ro�X����u��Ƌ���T��
)���&[U��5�8F�-���YűYa�����fSZ�Ȟ�G��B��-��fA�9,A�/Hr��0�ìz�>%!��l���<���4#�M����d`[jA�ʖU�m�4��ی��o�km29zۦ�ƥ������ē;������p�k��,���3�	�'�-�E]ea�aRĢ���_��rV�(Lʰ-ˬp�	�s����7s����G�ߪ������A��-i�x��E8�V�jN���&���.W��21���y����s6�i��������0���j�'��hB|(+;
^9O��|�C>�    /����C�L�KϸA�-��#x
�pv�����
�9������[^�I���ڸ�+�`Ԓ�hv�]o=������ًd�B���C�g9�W�f�:>Gˏ�ȸ�(�+�V���l
�)E�7{L\��8�����^�q��ï����'�Qb!A$:&n`���Շ:<K�A�}�$��6<cn�#������抉S���\�ei�p��fL7{��^�Or�]����+���o���y��e��)G"�L(V��'�`�V�e2�p��&���Fs��)k��E˔5MWt|����C �.\���n����DO�:L��b	o�	Uإ��D�и���Ҿ�<���n3��C���:��#!e�a8��b�|���񣰴~���4,Н�h��4�A�$丧a��QZ�ל6�1T��=`�<�Ů��xV�xt~ΰG<1����`E�C������J��J��ž�)�"�Q����ya~:���^�ҎJ-�v6H��.�Y�zp��	��}ȑ.����ۑ�a�	c	
�8ǼM̳���5��Z�3˸�j%~]` )>	&���#)�GlV�N�\%0GB�htA�J(ޚ<�%܁qLjI@�ZN��s�o2�-2#"pY���A�qh6�g��:�X>���!��m,�zdS���v�Ɨj�*���ɛ�G���O&����~K��{�'�����bhO[,9�Ns'�k�xoԛN�]g׏����c�����0�d���G��q�H��A���|�?����� ��t,r�����4���<���� *v�m�Y��*����7p�(�ⵂ��Mt�x�@��V){�%D
��WZ���$@�����V�4ʁ"��Pb�⡝�h�y/H!y$3�f\�?������P�*=2�w}�~�Uk��u��[=��z��ju��F���I��@�jS����vc�( �x�m���Ij�P�t<Q][��U��c^�TS=��ݖ#S Ip��1L?',dď��?3�F#h`���9q��~�D1+���4� ���V3�ǩ�Pi�O\xw�v]���B�;��V���6����IR�@���L������
k�# ���&����H�.�`�!�{!dJ�O�bR����*qN�_6���8ֈ���3t�+�2NI��+���"��%���^�|ؗ�!i�[�a�)<�P������,ٴ_!�8U�
��[�
�ϟ���`�_�����q���z���t|6�
�a(dI��1EH|��T�6Z\ьI�1�(*E�󯷷�VZ�P���@�|V^��+�}i� 8-�_	��&ڶ��ݾ׬��n���ҥ���^��n�ɦ������뺥�koo4_NL� A�� I��i�"��� ��ܪ��s����]����^]�Eo���:�Z�������W*����� ��,"-C݉�t���,�{�y`�5�I��]���Zg�=�z{vs����~�D�#2����Öx����f,��B�rl� ��X��pGp[�`0�� �+$�'ʵz�����eFh>JV�����Ջ���<�T�\�h�Yt�s��a`p�ׁ�bBqf��>��).��p%�#��#� �<��*B ���F��eI��A�I���_]���7x=~R7��J��j	eʧ����+�p�0]I Y�=t7��1"�G�`�Ԑ���8��؝����f�&^�����ۑ��t5��#ES>8s�� �~��U9��b, �Lh�V�]:K#:��{ XX� �V�.T$4����D� ǜ`�yS����a�o�+��UT�h��B%��e�A	.�m(�к��!���7��pz0TǷ��������Oba�6�0�(���p��9��6���	#p��&s\�낤���5���s;�
�O�I��hx(��}�,Np�dt`!	�@_���*��`�_ﷺ�N��im�P7.��w�_�V���U[�m�;��.��]��^���^���4^�<آ�_�ڂ��W7�N-���� lq�J��$����f�����U�<�c~�v�3�W�F�������Ͽ����e̒�D��V�8Hm!]k�)��rڣx�I ������mHv8�x���iCq{�� S���9�{�Xذd�1�\��b��X���38Q�d�0��i+��tX
T�cx"��.Sv�ǆjK�w_��z��U�Y:f�����V	�@� P��$��d����haK��?&�����P���nF*�3WC"�&��a^��B60)��&�k���[ ��vk�>2��*ВAĆ�p�>�����j<��4\�����v_�������K"�E���	#��DB8�
v�I����˲0 1}gr@��bG�͂Y!�Q��9(bgp�"�2��K���ڕ }���1jg,V��Qԃ�B0/c��Nd.UWK�R���P�)�����j�2(�;a]� i*���gy`@�ۜ�Y>{�,0)1��x�׭>-ʄ%f"8P�4�8�������u�6?lp7f5Ļ`ʉ�T�q�3��B,�u:�:-��b�Z�$��Ў&�#�� R6��>��Y���f�7���n���yՎ��|�y'���h��]���Py.��j��m��j;����QU�	H�y�^'���7B>V����#�����o+y����'��ȀL�c��5����M��b
�818��ܒ��Vw�겙�9o�$����EΝѳ�2ٯ�I�1_+G��4�_Vt��I��e�N*��p��7�LZ��׾����K��A�`1fTC+�"�d�+���w΄�k�8�:�f���u[ގ��#�L�z��x��v�4""�(����i|v�	�1ۃ`� `�[�6�C:~i"<�3��Fe�,/A���I=���`�?���+���6:}N+�~���L$A��qغ�6�JN�;�6��/���IB��Lm���U^�����.ڭ���v��kt[�/]z1��m���F,$:�_t���t������l�N�E�j�U��/�(Uծ�3�5r��H0���P5!�M������K�R�ճ�̢�%Ѵ #�1�v�p �8B��0�MYc�9`I��E��Q'��
�nq�Ik!�H�r=M~��w�A���%��O�>�˻��Eϻ�^ ���e�ilY	w�ʵ�d�@�J�o��5uh�[�Svαz�f�{�YP���M��1��:�G�I�r�pr�N��"�ɼ�>-�L66GX����K�b`����HP��ߦ����Z����|w;fq0�ۅM~?��?z����0V�v{�d�ӧ�����F]��8|fd�;5���U�<�O`��dp}c6G�?���~�]9�o��$ H�K��)���ةz3bm�*E��;���Mu�k�^�u��o�G�W����ת�j��~���D���N�S��a��bXm ��n<b_�֌�	���L��*�oY��#�P����b�,�7�'m$~����K�XP���}���} �	�t]]�d� eSx�%v7	������&Ԅ�����A�i����BZ#r.�,�z�2ܿ�/KD�gCn�q�w��6���~YE�j�k��RpV�[s0�UA܇6�~Ś.���u${�(�U�;�0@�&�����m�\�k9�vL�9^s�>(S�h���0��ϴ�˄[�N�7�_2Eк���6��1�@g\��0N��3d�9Ł=���̐[��q�X���T��#�h���<"��Tv�&0��R0W�oU~�ه6���)���ӄu�௎���^V�O ���|�rn���%p<}��d_��=��Za�5�Y�:��#�k�3���ߪ5:�Nv�{�E���뭆4���a�A�����JC��������Ko�e�MR���#d:s
҅���b0���}���:���IZ�����K����Z,Ua��BZY��<ƚge���&��L.E%�nc1��X�����$��uq�x'
B�Z[��M���L����̽�$��cE�I#�d��i�^k`    
Yu���\��a��-�9�t����aS<�j��*	�%V����0�|æC9���뤓1�MY���}��ƄfK&�`��H�D��$(]��)^��ج���7�������uK��{�S��ϣa��l�E𥥡1"�����b<'S�������De���g}��Q%�o�Y~o9.���W�n�ocǀ@�S�_f+I�������|�D����P/����dP)abr�0��I[�&����f������\h,FW�=P���1�?���/3�k�l�I�Š��u�1��$�WL���H���1���j�l;*[��hאL��ɟv/�nm6�ݞ_�z��E�^޿�l��ޞT��h��b��H�d�)��e�euH��S�ө���ƒ2F?����Z��ӣY����e2�.��+=Y0zE<��O�	���xB(n�b/7�L���~�f�����u����ߜ�{�����t:��S�97ں�6��{��3��,[�Kq���	|lm�[5͘�f\���w���)?%i)��[.��ܚ֢�s|�eQt�	�-6	@�bS�$/��=[<�t��I�eU�l��	���v/���yDف���d��c_��� 5�Eaa�X�0�R�9���/�|ni�����.���<�fz�q����a�dV{�xZ�����Pjk�&xb|�/��h{�L��6]��@<�.��x��3Pͫ��N-D��(K:U��F�F϶�9YH�.��"N�Ѕ*��ْ�X_�)�9_B���y��&����ih� |f-��2��C�Q]R��n�n�;�����@���"+�_ө���N9�
E���l���#��B��wm):9������pӝ����(�Þ��.�]�����<brN�
GC������}��T$��_��>�RG2�A��E�����}Yⶐ�#q[�V�F*V��S�Ľ�����j{,99�>�o~�kNR⠀A�/�M�;���ʹ���:��ޜ_�]�M�������V�uXC󛢚i|����qU�,�D/����Mo�E��P��`���ҭO?���Ա�G����,9�_�4�Q����mUxK,
d#~�1LT�1Z�ӏ�UX��ps�el�z��P�N�p�D�ӂ6\#
�Sr����N�����,�g���Y�Nj�6�P�*��W�O�\�$a���[_f\b�`����\+&����M���.Ħ�2�5""��_�����b��u��F�ۨo;�^N���݆ߦ��ݿ��4_w�7�������8-*��W�*$�!\îd�	m��Hr����ba�[.����U�Μ,��&?��ض�����Cn��##�mhƶ���T��$K�\����0���cExWT��d���f2vl)q2�*$Ƶ̀a��0(GpD�Ce��1q�>'$E��l5sm�h�A��!S�Q�Вߤ��BcA�Nʞ��FaԝӍlڲl�[����Tj�BM$��&�q�Кe��=�"ԗ��$��|Ɩ\ �� dMx!�EJ+N> hi:�m��-NT��u���]���Z�j�,�$\k�
���4�{��gf�#�:mP���⑱�R�Ԏo��Q�0D��oe,Y�S�S�8at�	͐r]��d����:���� �͌����l����}��B3�%I�Gq������5>4-W�bYQ���%�RW��h�+F�j��,��KC����_�5nv{{��4�V���ڽ�����K/��^�ksD�;���O^��[�D{�̨Ke@d/����؃�Y����V[�v�U������kxK�W��Or�OX����w�@2��Q��
X��ך��T�3�H�~�Z��t����{2A8�y����EG��&�<�
Ğ����hw=�Ko0�T����v� _����d[s��|~�Ͽ�7X��&�pb��b\r�������z�ׇ#M=��C��axܭk �YJX��50�2�I����[��P=�S�8����G#�Υ��g:6����ʔ���� ˣ���!f�G�x�'�d( Kk@�C�z@�Cʯ��f���8��[q]
�AL�2l{"�٬�5����X�����a����8�B?�mV%����o�)/SL�;OH����RT�����f*�N>���t��MB�s�P	�qy����خ� ����N)��x��#�P��
���HUDZR>z��ׯp�˵�d��~��m����f���=bY�<����[�e�w�	�4�����z�r��`_�]��CET�޲I��Qb]�Z�j��:��EB(��s�Fz�����A�5k�3�Q�j��
���_ѱ���ӄ�HZ���uB�����BiV�V��EPaП�eڴ�kA*�ّF=:�fs��6�����K�GJ�{�I����lvw�Q�~��"c�6����Q[�N�ku��Y��� �@�%O�+��ͽ���p��c�����f�����[�xa�^W����"\R]а�����b��:�f��uy9���[n�I)��5O9{uFe���K=�-���⣫դtU��]�k�w������N��ײ4_H�mw��߫������/?����D/�j��H�V�dK��b�Q/. �����ו`wE�>�8�u]�v�&F�QY-��F�
�$�ee�>�:�js�~`�a ��_K�t2��i*b#a2ۂ��˭�D`��P��G\!�����'�]��e�;:�j���ݾ1�Z��w;���п:ċ��5����~|?zm׼�I�$����O������Aw۠�5��7Y+7��U�v�y5��$q]p� n�32+�0��i�g�Š}�)�:R�DIʥ�[���Y���!�t1q 0���G��%�뷋�@�I5�a�2z��my�:��S�I��*��e���HC��N]}8��^r��j[)�~GƖ{�-Z[k-o�vb�۲:(�O&�r��[����$kSJ���f��3D���wv���m�_�-`��^��-}�.k�u���w��<�լ��f����痲��_���P�~ͥ�>��k��*�Dt9��>(�j�������x����ű��8��v��#�.�����Z{p�	i���F��?����
�
�B'����r�lM����-<�(�K'5Z�4�;�w^p�[��q(��"�����x(��g�!N�b���w�TIt�M�|OM�1�&8���$�=��%\���Hu�͍� ��v��WQD8X�?/����$�'�J����[���;/C������5K�s�-��L���^?�nO�%�9� �ȍ&^�$�F�3"&�[�/�`H�\95�2�MDq 0�_2�v(�K �q�Y��I�'�CInO�VGӸ?>;��,^�3����b٬$��d�8@����Aw�"Y~7����O[Ҥ��{z���V�u�e6>lz�~����p����'2zJLxžX��5�����<[-��@+$v���}�!�+���.L��@,f�ҕ#��55�Ek���L���9+W���C`1�3����JwR��cQw`(���qͦ��E�o�t.��I9&������/�-69*��|R�5kx������;G&�sX��kos[٘7�6�M��mg�agu���[�>��]��Aa��3���xD���?45ص�
!��Pe!͍�x�vc�u�l�����*��/�~N�b�ld�q�٠[<��5ds�l�|�X�I+���"6ʈ��P���<+���-�����r��9�،d�S�e����x��'�+vv���S
x[ �"�3��}�-�oi�����M@�\{�(�P��o��/t��5�)m2�_(|m�Uo�>��W����m��[��k���r��I�Wn�=��nC�;H���(Yvܸb79�L���F�<�ߪg�~���.�!�z�T�G�.��Hz6������c�L|��p���Y���ħ�t�>��Uq�qu��ui�����r��Y�N^����]��
��K��ͺ���+%��H�����Z��B��	m�Q8��!��;ӊ��aT���Fb��� ��� ~J~#�0,'1�    �2�N�<�E���қl����?�=�d�x=�%���ϺɓTߓ?�6'B�Y.l�r]6˄"�$��0�n��9��'�:���p$΅L|��M����N��[�k�F�Sw|�t�;�f��Z����W[��~��ҟ�����7r��0Ԛ_�������3��cuQ���՛��NŦ�uJ�����R7}�P�������א��S4-���6�4%S��t��z�W�ܰE\���Zd���:d��$i���t�x���%�Vg��ݽ��!)��
�B烛����l����o!6�������M�٫��������v\ɧX��^��V#p����z(~�t��X8�{���l`Oߜ=�=���c�oG���V���2���Z����u66�ѯwPԾ��:�߼��f��n���w��~z��5��7��V�D���l�?�N]���E��Z�]�E>�_%e����.���)B�;K�J ���6��9�k－��~�#�Ήν2�m8p*I��a^�,�4_H)n5�qZ�2�ہ��z���m��)��}��R���xͽ��>a-���c��-�6��n��ͳ���C��aC]���b@����-��7VWU[��t 4�:��âHS�����5�|4G��t��������@�\"��فU�i�{h}�TS!&��hkO�"saY#é�H�=�"`�&��6�Ϩ�\�U2�̝�l��8�l����°%��ȤA�ݣ`���7�"qI�JRC�`q*o�=��7l���]ҧK!@Nф0�!P@[d�IK|P���`-�w�m`e��ҏ�R��F���8s��i���H���S��Ӌ���<� O�~?�q��-ה�i�s�:��6?�i$�guc&ǫȟ�̲��ʭ&ŀ��+���,͆M������8��3?���Qѐ���X~���N�N..�.�?U~~�"�4�8
�b�I���Ǭ Om�&[5�lO_�����`�E���X\�z�Q3���):�lǑ#�W�Z���$���>��d���Ķeg8ד�}(i��(à�T.E렣�SƟIIU�8�	���r�ƥ�ɴ���6p��B��L�'ίM����u�n�F��^]�V��ঢF�5��N��U��:d:�M$��!/i��9�~e���BY*�|�
r���zL�7�p��e(�%��2qN�dMECS��$�&M��O!���4C�EU��/�yO{��_��p�*f*Z��f�C�6�+����e�E�[�$�	g+=#[ꬢ3<�@# s�
�w����A��������F��ho�Am\z%����:i��4�:�*;z�m�V�=����.}�R@AHxX%���d?[%\��y�>?��y]����8W�GW�2��k+��L�f���Ҵv��HZ9�i;�>�L��ͳ��?^��y߼9����;y���y�����=����s�fo�8��>�G���f���x���x�'ܧ��Ѥ�7^q�H����W�Y��7�~�x\�?w�Czy��b8N���<��b�f�\0�˨���{�}��X�`ҭ��M��i��7�"�i� ���u�:{e�w8�{mD̍bS<��L
z,~�2��K���b�l�fw�>J�%mg���S���i����&(c�}�^	M���P�_q�f&@��.ԅז\���UȲ�H���ÈM�ħ�ZK�^G�&�
�l�^;]Fu{�JI��)sS��h�i�����\�`aB�,�Q�L��rV�M'+;��$Z9�h�$��n#�.I�����ϑ�$��`����I��ySh+�Ѓn����))��9z���H�`��|X�RХ���,%�=JQ$�Ѿ"�%���e��l�i���Xh�L��D�K��Ɓ��	��54;�C�:6�>�ߖ��:����_�QM�ξb=�K���ݽ�ȇ�+�k 
fd*�3���B��T��5u%2�)�mu9��;M�y��*��T�I�%O�:����(���������D�~���vj�����N�olgbl\z��k����.��?y����Q$���F����L��wP׈6��J�>�߳;{��%؉�p��Y�/��si�$��g����U�_�(�7��n�u@������O��u�QK��h���v7�X`k��AӭI���L'1����|�L�Q�j����CN���0!Z!�+ӸP�4�v�[ ��8CJE����7���o�H�̘c�EH��"I�Ҷ.0=Ej!�ښ����Ҳ��p՝o�\,Ҍ��;p��&��f�I*���.xA�cc���Ri*�o�V|�*�����Ǭ��+�5�`'f!Ke'��H��u��7e	�,僉��)I ��D�ײ��F��Z̐	ⴒӕ�.��Y8YO�#˄V逧�gԅ��g �1�d1�1�y��f�>���͋l���v�޶�^��Vq�C��z�/~�~8Y���a�+��6���8D{�PR��]�
�NMQB���Qk�lZ����&ޝE�}�T����B,�Y�F����l8z����p���}_�����;���q�^�Qj�g"��+fZqoi�=r����^9������;,�3�ͷ�jУ��$+�X�+��ؐ����8Zh������kF�\~^�Q�`��]�n����㝬-�YNL�����Y���h�JbO�`�V�j�����unv��.�)#0��t��4[�j���.w�xV	B��ݨog�7�,U�\����b���}d���=��(�(�d\ʬ�_4�i�qc��0PEw�d��q�`��[�@�ZX]Vz�U�����	X,6=6qzh941<��8�+p58�_�m��rs+��wɡ��KW'�<��zLcph=o>=;�n/ʉ�^�;;8�aK$��[_)�_Ӷ|A�C_݅�rU��ƨq����Ɔr+
��q֣j	h�Шհ�,�?���\�k9_看�3Ԣ��b�J��4R,],"A� b��0��N�� �9���"����ͯ�i�����Z��u��ĻW^b�^��y�^	�������X�q����7ß�{�٘�e�ϝ~�U���6L���Fbt�S��c?lt����J?�c� ����k�m&��4x��:�H��6\���K/6�p�嘌@�ngrj�Lϡ�ݘ���L�E������b�{涓/ӽ���t��u�Kӧ!�t���t����g��$��'��	/�����gگ͆���1�Q
�etι��8ȴ�*pP�:��H�8���]�Xî�E�_SL��*�m��2�P�u9=לE�j{ل�6] mksح�ƩE
cU����j�)e�����2h��$)Yl�q4�'2�7���Pt+!i=��<Z�C�9�_�2�rXw�iۗ[G��LrҖi?�$Z��Q2�bqe�����w���w�i���(n`j�� p��y�X����{b�D:N�l�(�H���?�պ�j���e,-�1�6�a�F�Ɍ�2_��E��'�/�H��[ ���=��:�@|l{M��X��v��(�W�u��N'��X��>/(����{����	N���W��[~��ނ� �YC���+�Am����������O��!������n	V]ǫk�i�S�^�@ݤi�V}�?�t�#"BM�?\���?7]1�w$]V\�����ew�K��k>`��)�x����\��}T�����2+3l���R�n�%��,J���G����%Ĭ����Ԛ�xR�8蕩'�ڹy�~�D�n'dy<�sZ�Ӳ�C/��'z��旸�b@IQm|���f����&��3�+��-��]�q�͹8'XU�!���_���/�w��ɒȗ��(���-q����q��(1;��ŒB�[��Z�w S��x��G�9����%e=_r�!"�Z���/<f]o������0ߌx��آn�ۚ�HS��F��`��QQ�&�H{�����I�9���BI1����$�#����.� y߂F�L#4��c���΄$�YgA��T���n��r���6��ө���M�!Bυ�3�_jwS������{G+TG> Js�V!�%��R�5   �|��2[ ��f�F���ޯ7j��ڍmq�@�߯7ź�wPPͺ��{զw�]7�n��!\��U��w��J�!�DK.��E<�����r����#Øn��_i7H��O^aS�w����uE���B�b��(M���=wn��P���~�K7���0n%:��O���T&ӫs���N����_�b��,c9����@>0�p����~�W�����s�p�	�.��f�z�;>nt���m�p��Ԉ���&����9�:O�t�_XO5e�I����NE�TӜ���Pk��Ab����K|̕�G#�d���+�m!�[�el\��|uy=.��ue�<���w/�ߏ��pt��NoN�I�Zg�HaǶ��t��
*��D0���Y����\����!w�4T��s�`��ܗvӶ<!��l�j1/V	�0:��� �:�zO�b�X�wP����b�������d�>�no�n� l���|Y������z{��h�������ƋZv��mx-����g���u�����P��_��~t�qtN�r�U�IU�z�H�ݲej�o
��v.�kS�Ƴ;L^q�/�����+.�
�e��ƾіU��N9O�W�A����Z����������?���V�ۤ�/����4��N�Ҩ���IJ�X!�+�Fѓɿ��.���\��vY�-Y9�ƌ�G��Ȁ���)�ld&.�Ҽ�"8�MM+谥��8,$=P�5�Su�P�|X�AYz���O�6�X�����j��l�,m�f���v!�2���W���7קW�?�~����.iՅQ��7��7*LPv��g[*q��W��T�Y�O���b>���殓l��� 5�]Q�n��Cu{��{7<=>ܸ	������'�����P�N�qB�\0kS�OGE���γE�E|O����bW�d�,�	��j<��F��,@�L�K�7��u� ��º�n�;n8~+�H�X�P�|�&a�y<��V�C)�xac��F��̓޳Pʀ���
:Wzr��Zc���M�T�����:���^s����i���'�$ w����Kr�������߰��� p���uQr�e�?�8��y��{���<aFc0���I��b[p\0���e;���w�d����/;ib����Ir㮃��$��7w�r��)�;�p��;F��|��V������|�;ٕ��dW�F�Z0�V4�}��qF,��2���4O˦p�v��!��DBV�T�)�%I��X��\�5��D�I��r���ŷX�|�i�V66�/�0T��4�g+H�X���ݷ�+G'u�"D�v7��p88����j��[��bS^��}$�� ��~�M�6�Ԥ�MY������8��ؤ��|t��V<�����tZJ�u.�Wލ;�zB븁�)V����Y}?A��U	F/�m�LL2ɝ���?��n�<c;�%t�f�k�!��<�l�N����v�Ҙ�9i���0+�,Z��k15������������.�ʤ��Z����/���߮���M�{�~�q�%�o�����u��c�����ߒ�%      �   V  x�UUM��6=˿bn��zW�]`�C�\
�i��9%��Hٳ�H����J�]`W_��y�q��7/���i��?B�ɜ�D��&�)I&�lni>�!�\"��Y� �D�I��W�-{�r����:�r<�GD�����[���9K"�{2<˱$b'?��Z�TlG_�Y�q��4�H���agSG��>F ��g���䈂#�Aw��c�v 1��bc�͎�ڔ�<�i
& aJ��FN^R]�;'I!g{���*r<�5���ȉJ�,~S|F�������E�J�{I9t�'����coTۯ���!
��J�)�"��C�K�і�p�`$�*���������Pi��w�!�)���9$؄�Z2E�ɩ �Fn�@�[�s� ����Pucr��j���n�Q�R�z_8�܉��e �^Kp%ϊ���v���U�Ռ}�l��n	ĪJ0䂤`��lTE=�y#��Ԃf5,.���nRJ�������5�'� ������� qmks`�`R��,�_��1G�ES�t��z�������x��W���M���$G��j;[���(�|f  ���3#<����GM���j��M���g�F�� ��:�+��N�4�ht$��� ����E՜��n�4Թ��DΤ������y+�թ�OR'�:�\Qo��a�mۆ��|l��l��6��*Oj�\������}�_����g���#���id63'����_�ǽ�?5�C߼��o�e�3�t�P�>�������$H�a��ԇ�<��<z�_�������@���&�.�.z����~��bxs#�����c_�����#��1��{~h�����"�����v�� �8q      �   [  x�e�Ks�@���+\d�L?�V�7���G�j��F|���>b�Jf���nNU���=C��s�r�+CVЈ1�i=o�u�p���E � - 7!�DEÒ����҄���� ����܇��͍��,]�|�y�;utpM����9�'Q�9�����Z=A�t9��7��9��!M��˄��ҋ��*�n�H���t��g��$������×Ԃ�6�Ec�eY�[�IP �(s�3Q�4M�?�W�3�o�<�)/r����j���;�����n/��?v��)z�*�J�P/�*����(iB��h�b!�iSOiZ�tӄ*|O�e�5�
�d��R3`��DP��1����3]��b��tUc��ZƼh���)W�=����$r���ԋ��]Aw������;.Ց���� R�����Ɉڬ8��Yp0�� _ۓ��"}��-tk�E^�N���&I�#��:��h�]XX��W�_�p�Nn�Ӭ�]�,��/���d9Sh9v��\
%�ȒrȻ�k�b��6Y���9O�&�&�t;Fnn�o�ܝ��z��Q:�iP��¯Oz/0Y8�՘��v|:t�:�w��h����      �   h  x����n�@���S�p�2�m�����b�7�2�:���^���&]����e�/��:t��χl�jPN���=�ԝ�"������T�o3���	��Y��8�#��1@^�c�1�� J���4���\����>���D���	����㤑���='��������_�<��N�m���)��n1@bz��ݿ-���*�"��^���F�o� ����[�����B
����;h��>;\,�c��-u&z=�'+8���Bm]5:s�k�b�Cq|�5+9����|��Ĺ �
�G�ҡ�\!��ᚺ�i��#����5J�`
�Q$�i=W�����m�R~�皕���SG�̆e��tə     