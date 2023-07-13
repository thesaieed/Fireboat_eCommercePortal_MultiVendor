PGDMP                         {         	   eCommerce    15.3    15.3 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    17111 	   eCommerce    DATABASE     �   CREATE DATABASE "eCommerce" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "eCommerce";
                postgres    false            �            1255    17112     main_update_modified_at_column()    FUNCTION     �   CREATE FUNCTION public.main_update_modified_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.modified_at = now();
    RETURN NEW; 
END;
$$;
 7   DROP FUNCTION public.main_update_modified_at_column();
       public          postgres    false            �            1255    17113    update_avg_rating()    FUNCTION     �  CREATE FUNCTION public.update_avg_rating() RETURNS trigger
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
       public          postgres    false            �            1255    17114    update_product_category()    FUNCTION     V  CREATE FUNCTION public.update_product_category() RETURNS trigger
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
       public          postgres    false            �            1255    17115    update_product_category_after()    FUNCTION     �  CREATE FUNCTION public.update_product_category_after() RETURNS trigger
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
       public          postgres    false            �            1259    17116    cart    TABLE       CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer DEFAULT '0'::numeric NOT NULL,
    product_id integer,
    quantity integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.cart;
       public         heap    postgres    false            �            1259    17122    Cart_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Cart_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."Cart_id_seq";
       public          postgres    false    214            �           0    0    Cart_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public."Cart_id_seq" OWNED BY public.cart.id;
          public          postgres    false    215            �            1259    17123 
   categories    TABLE     �   CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now(),
    vendor_id integer
);
    DROP TABLE public.categories;
       public         heap    postgres    false            �            1259    17130    Categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Categories_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Categories_id_seq";
       public          postgres    false    216            �           0    0    Categories_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Categories_id_seq" OWNED BY public.categories.id;
          public          postgres    false    217            �            1259    17131    discount    TABLE     �   CREATE TABLE public.discount (
    id integer NOT NULL,
    name character varying,
    "desc" text,
    discount_percent real,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.discount;
       public         heap    postgres    false            �            1259    17138    Discount_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Discount_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Discount_id_seq";
       public          postgres    false    218            �           0    0    Discount_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Discount_id_seq" OWNED BY public.discount.id;
          public          postgres    false    219            �            1259    17139    order_details    TABLE     �   CREATE TABLE public.order_details (
    id integer NOT NULL,
    user_id integer,
    total real,
    payment_id integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
 !   DROP TABLE public.order_details;
       public         heap    postgres    false            �            1259    17144    Order_Details_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Order_Details_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public."Order_Details_id_seq";
       public          postgres    false    220            �           0    0    Order_Details_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."Order_Details_id_seq" OWNED BY public.order_details.id;
          public          postgres    false    221            �            1259    17145    order_items    TABLE     �   CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
    DROP TABLE public.order_items;
       public         heap    postgres    false            �            1259    17150    Order_items_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Order_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Order_items_id_seq";
       public          postgres    false    222            �           0    0    Order_items_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Order_items_id_seq" OWNED BY public.order_items.id;
          public          postgres    false    223            �            1259    17151    payment_details    TABLE     �   CREATE TABLE public.payment_details (
    id integer NOT NULL,
    order_id integer,
    amount real,
    status character varying,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
);
 #   DROP TABLE public.payment_details;
       public         heap    postgres    false            �            1259    17158    Payment_Details_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Payment_Details_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public."Payment_Details_id_seq";
       public          postgres    false    224            �           0    0    Payment_Details_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."Payment_Details_id_seq" OWNED BY public.payment_details.id;
          public          postgres    false    225            �            1259    17159    products    TABLE       CREATE TABLE public.products (
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
       public         heap    postgres    false            �            1259    17170    Products_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Products_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public."Products_id_seq";
       public          postgres    false    226            �           0    0    Products_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Products_id_seq" OWNED BY public.products.id;
          public          postgres    false    227            �            1259    17171    brands    TABLE     �   CREATE TABLE public.brands (
    id integer NOT NULL,
    brand character varying NOT NULL,
    created_at time with time zone DEFAULT now(),
    modified_at time with time zone DEFAULT now(),
    vendor_id integer
);
    DROP TABLE public.brands;
       public         heap    postgres    false            �            1259    17178    brands_id_seq    SEQUENCE     �   CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.brands_id_seq;
       public          postgres    false    228            �           0    0    brands_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;
          public          postgres    false    229            �            1259    17179    newvendorsapproval    TABLE     d   CREATE TABLE public.newvendorsapproval (
    id integer NOT NULL,
    vendor_id integer NOT NULL
);
 &   DROP TABLE public.newvendorsapproval;
       public         heap    postgres    false            �            1259    17182    newVendorsApprovalList_id_seq    SEQUENCE     �   CREATE SEQUENCE public."newVendorsApprovalList_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public."newVendorsApprovalList_id_seq";
       public          postgres    false    230            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public."newVendorsApprovalList_id_seq" OWNED BY public.newvendorsapproval.id;
          public          postgres    false    231            �            1259    17183    reviews    TABLE     �   CREATE TABLE public.reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    rating real NOT NULL,
    review character varying
);
    DROP TABLE public.reviews;
       public         heap    postgres    false            �            1259    17188    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public          postgres    false    232            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public          postgres    false    233            �            1259    17189    shippingaddress    TABLE     *  CREATE TABLE public.shippingaddress (
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
       public         heap    postgres    false            �            1259    17196    shippingaddress_id_seq    SEQUENCE     �   CREATE SEQUENCE public.shippingaddress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.shippingaddress_id_seq;
       public          postgres    false    234            �           0    0    shippingaddress_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.shippingaddress_id_seq OWNED BY public.shippingaddress.id;
          public          postgres    false    235            �            1259    17197    users    TABLE     �  CREATE TABLE public.users (
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
       public         heap    postgres    false            �            1259    17205    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    236            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    237            �            1259    17206    vendors    TABLE       CREATE TABLE public.vendors (
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
       public         heap    postgres    false            �            1259    17214    vendors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.vendors_id_seq;
       public          postgres    false    238            �           0    0    vendors_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;
          public          postgres    false    239            �           2604    17215 	   brands id    DEFAULT     f   ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);
 8   ALTER TABLE public.brands ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228            �           2604    17216    cart id    DEFAULT     d   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    17217    categories id    DEFAULT     p   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    17218    discount id    DEFAULT     l   ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public."Discount_id_seq"'::regclass);
 :   ALTER TABLE public.discount ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    17219    newvendorsapproval id    DEFAULT     �   ALTER TABLE ONLY public.newvendorsapproval ALTER COLUMN id SET DEFAULT nextval('public."newVendorsApprovalList_id_seq"'::regclass);
 D   ALTER TABLE public.newvendorsapproval ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    230            �           2604    17220    order_details id    DEFAULT     v   ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public."Order_Details_id_seq"'::regclass);
 ?   ALTER TABLE public.order_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    17221    order_items id    DEFAULT     r   ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public."Order_items_id_seq"'::regclass);
 =   ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    17222    payment_details id    DEFAULT     z   ALTER TABLE ONLY public.payment_details ALTER COLUMN id SET DEFAULT nextval('public."Payment_Details_id_seq"'::regclass);
 A   ALTER TABLE public.payment_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    17223    products id    DEFAULT     l   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    17224 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232            �           2604    17225    shippingaddress id    DEFAULT     x   ALTER TABLE ONLY public.shippingaddress ALTER COLUMN id SET DEFAULT nextval('public.shippingaddress_id_seq'::regclass);
 A   ALTER TABLE public.shippingaddress ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    234            �           2604    17226    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    237    236            �           2604    17227 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    239    238            �          0    17171    brands 
   TABLE DATA           O   COPY public.brands (id, brand, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    228   .�       �          0    17116    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   x�       �          0    17123 
   categories 
   TABLE DATA           R   COPY public.categories (id, name, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    216   ��       �          0    17131    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   +�       �          0    17179    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    230   ��       �          0    17139    order_details 
   TABLE DATA           `   COPY public.order_details (id, user_id, total, payment_id, created_at, modified_at) FROM stdin;
    public          postgres    false    220   ڸ       �          0    17145    order_items 
   TABLE DATA           X   COPY public.order_items (id, order_id, product_id, created_at, modified_at) FROM stdin;
    public          postgres    false    222   ��       �          0    17151    payment_details 
   TABLE DATA           `   COPY public.payment_details (id, order_id, amount, status, created_at, modified_at) FROM stdin;
    public          postgres    false    224   �       �          0    17159    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id, avg_rating) FROM stdin;
    public          postgres    false    226   1�       �          0    17183    reviews 
   TABLE DATA           J   COPY public.reviews (id, product_id, user_id, rating, review) FROM stdin;
    public          postgres    false    232   !       �          0    17189    shippingaddress 
   TABLE DATA           �   COPY public.shippingaddress (id, user_id, full_name, country, phone_number, pincode, house_no_company, area_street_village, landmark, town_city, state, created_at, modified_at) FROM stdin;
    public          postgres    false    234   �      �          0    17197    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified) FROM stdin;
    public          postgres    false    236   \      �          0    17206    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    238   �      �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 171, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 115, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Order_Details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Order_Details_id_seq"', 1, false);
          public          postgres    false    221            �           0    0    Order_items_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Order_items_id_seq"', 1, false);
          public          postgres    false    223            �           0    0    Payment_Details_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Payment_Details_id_seq"', 1, false);
          public          postgres    false    225            �           0    0    Products_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Products_id_seq"', 103, true);
          public          postgres    false    227            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 35, true);
          public          postgres    false    229            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."newVendorsApprovalList_id_seq"', 22, true);
          public          postgres    false    231            �           0    0    reviews_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.reviews_id_seq', 78, true);
          public          postgres    false    233            �           0    0    shippingaddress_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.shippingaddress_id_seq', 2, true);
          public          postgres    false    235            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 131, true);
          public          postgres    false    237            �           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 32, true);
          public          postgres    false    239            �           2606    17230    brands brands_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.brands DROP CONSTRAINT brands_pkey;
       public            postgres    false    228            �           2606    17232    cart cart_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.cart DROP CONSTRAINT cart_pkey;
       public            postgres    false    214            �           2606    17234    categories categories_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    216            �           2606    17236    discount discount_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.discount DROP CONSTRAINT discount_pkey;
       public            postgres    false    218            �           2606    17238 .   newvendorsapproval newVendorsApprovalList_pkey 
   CONSTRAINT     n   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "newVendorsApprovalList_pkey" PRIMARY KEY (id);
 Z   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "newVendorsApprovalList_pkey";
       public            postgres    false    230            �           2606    17240     order_details order_details_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_pkey PRIMARY KEY (id);
 J   ALTER TABLE ONLY public.order_details DROP CONSTRAINT order_details_pkey;
       public            postgres    false    220            �           2606    17242    order_items order_items_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    222            �           2606    17244 $   payment_details payment_details_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT payment_details_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT payment_details_pkey;
       public            postgres    false    224            �           2606    17246    products products_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.products DROP CONSTRAINT products_pkey;
       public            postgres    false    226            �           2606    17248    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public            postgres    false    232            �           2606    17250 $   shippingaddress shippingaddress_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.shippingaddress
    ADD CONSTRAINT shippingaddress_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.shippingaddress DROP CONSTRAINT shippingaddress_pkey;
       public            postgres    false    234            �           2606    17252    brands unique_brand 
   CONSTRAINT     _   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT unique_brand UNIQUE (brand) INCLUDE (brand);
 =   ALTER TABLE ONLY public.brands DROP CONSTRAINT unique_brand;
       public            postgres    false    228            �           2606    17254    categories unique_category 
   CONSTRAINT     U   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_category UNIQUE (name);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT unique_category;
       public            postgres    false    216            �           2606    17256    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public            postgres    false    236            �           2606    17258     newvendorsapproval unique_vendor 
   CONSTRAINT     t   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT unique_vendor UNIQUE (vendor_id) INCLUDE (vendor_id);
 J   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT unique_vendor;
       public            postgres    false    230            �           2606    17260    vendors unique_vendor_email 
   CONSTRAINT     g   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT unique_vendor_email UNIQUE (email) INCLUDE (email);
 E   ALTER TABLE ONLY public.vendors DROP CONSTRAINT unique_vendor_email;
       public            postgres    false    238            �           2606    17262    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    236            �           2606    17264    vendors vendors_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.vendors DROP CONSTRAINT vendors_pkey;
       public            postgres    false    238            �           1259    17265    fki_brand_id    INDEX     E   CREATE INDEX fki_brand_id ON public.products USING btree (brand_id);
     DROP INDEX public.fki_brand_id;
       public            postgres    false    226            �           1259    17266    fki_c    INDEX     A   CREATE INDEX fki_c ON public.categories USING btree (vendor_id);
    DROP INDEX public.fki_c;
       public            postgres    false    216            �           1259    17267    fki_category_id    INDEX     B   CREATE INDEX fki_category_id ON public.products USING btree (id);
 #   DROP INDEX public.fki_category_id;
       public            postgres    false    226            �           1259    17268    fki_d    INDEX     8   CREATE INDEX fki_d ON public.products USING btree (id);
    DROP INDEX public.fki_d;
       public            postgres    false    226            �           1259    17269    fki_discount_id    INDEX     K   CREATE INDEX fki_discount_id ON public.products USING btree (discount_id);
 #   DROP INDEX public.fki_discount_id;
       public            postgres    false    226            �           1259    17270    fki_order_id    INDEX     H   CREATE INDEX fki_order_id ON public.order_items USING btree (order_id);
     DROP INDEX public.fki_order_id;
       public            postgres    false    222            �           1259    17271    fki_payment_id    INDEX     N   CREATE INDEX fki_payment_id ON public.order_details USING btree (payment_id);
 "   DROP INDEX public.fki_payment_id;
       public            postgres    false    220            �           1259    17272    fki_productID    INDEX     I   CREATE INDEX "fki_productID" ON public.reviews USING btree (product_id);
 #   DROP INDEX public."fki_productID";
       public            postgres    false    232            �           1259    17273    fki_product_id    INDEX     E   CREATE INDEX fki_product_id ON public.cart USING btree (product_id);
 "   DROP INDEX public.fki_product_id;
       public            postgres    false    214            �           1259    17274 
   fki_userId    INDEX     C   CREATE INDEX "fki_userId" ON public.reviews USING btree (user_id);
     DROP INDEX public."fki_userId";
       public            postgres    false    232            �           1259    17275    fki_user_id    INDEX     ?   CREATE INDEX fki_user_id ON public.cart USING btree (user_id);
    DROP INDEX public.fki_user_id;
       public            postgres    false    214            �           1259    17276    fki_vendorID    INDEX     R   CREATE INDEX "fki_vendorID" ON public.newvendorsapproval USING btree (vendor_id);
 "   DROP INDEX public."fki_vendorID";
       public            postgres    false    230                       2620    17277 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    243    216                       2620    17278 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    226    242    226                       2620    17279 !   reviews update_avg_rating_trigger    TRIGGER     �   CREATE TRIGGER update_avg_rating_trigger AFTER INSERT OR DELETE OR UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_avg_rating();
 :   DROP TRIGGER update_avg_rating_trigger ON public.reviews;
       public          postgres    false    241    232                       2620    17280    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    240    214                       2620    17281    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    240    216                       2620    17282    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    240    218                       2620    17283     order_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at ON public.order_details;
       public          postgres    false    240    220                       2620    17284    order_items update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 7   DROP TRIGGER update_modified_at ON public.order_items;
       public          postgres    false    240    222                       2620    17285 "   payment_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payment_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 ;   DROP TRIGGER update_modified_at ON public.payment_details;
       public          postgres    false    224    240                       2620    17286    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    226    240                       2620    17287    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    240    236                       2620    17288     brands update_modified_at_column    TRIGGER     �   CREATE TRIGGER update_modified_at_column BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at_column ON public.brands;
       public          postgres    false    240    228                       2606    17289    products brand_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT brand_id;
       public          postgres    false    3305    226    228                       2606    17294    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    3284    216    226            	           2606    17299    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    218    3289    226                       2606    17304    order_items order_id    FK CONSTRAINT     |   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 >   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_id;
       public          postgres    false    222    220    3292                       2606    17309    payment_details order_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 B   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT order_id;
       public          postgres    false    3292    224    220                       2606    17314    order_details payment_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT payment_id FOREIGN KEY (payment_id) REFERENCES public.payment_details(id);
 B   ALTER TABLE ONLY public.order_details DROP CONSTRAINT payment_id;
       public          postgres    false    220    3297    224                       2606    17319    reviews productID    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "productID" FOREIGN KEY (product_id) REFERENCES public.products(id) NOT VALID;
 =   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "productID";
       public          postgres    false    226    232    3303                       2606    17324    order_items product_id    FK CONSTRAINT     {   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id);
 @   ALTER TABLE ONLY public.order_items DROP CONSTRAINT product_id;
       public          postgres    false    222    3303    226            �           2606    17329    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    3303    214    226                       2606    17334 ,   shippingaddress shippingaddress_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.shippingaddress
    ADD CONSTRAINT shippingaddress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
 V   ALTER TABLE ONLY public.shippingaddress DROP CONSTRAINT shippingaddress_user_id_fkey;
       public          postgres    false    236    3322    234                       2606    17339    reviews userId    FK CONSTRAINT     y   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "userId" FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;
 :   ALTER TABLE ONLY public.reviews DROP CONSTRAINT "userId";
       public          postgres    false    236    232    3322                       2606    17344    order_details user_id    FK CONSTRAINT     t   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 ?   ALTER TABLE ONLY public.order_details DROP CONSTRAINT user_id;
       public          postgres    false    220    236    3322                        2606    17349    cart user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    3322    236    214                       2606    17354    newvendorsapproval vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "vendorID";
       public          postgres    false    3326    230    238            
           2606    17359    products vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.products DROP CONSTRAINT "vendorID";
       public          postgres    false    3326    238    226                       2606    17364    categories vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ?   ALTER TABLE ONLY public.categories DROP CONSTRAINT "vendorID";
       public          postgres    false    216    3326    238                       2606    17369    brands vendorID    FK CONSTRAINT     ~   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ;   ALTER TABLE ONLY public.brands DROP CONSTRAINT "vendorID";
       public          postgres    false    3326    238    228            �   :  x���KO�0�ϛ_�;��w������)�1JS$��8��8U�|���#\��q`�+��Br�P$HKKf��B�"n�z���p���ϩy�.6�As"òz�8h�3���v��]9�.��hI�\��e�Ї|�
�֘�:X���g������g�y�FJƓF%ܕ��Ћ�>�FI{n\��Fx�֩y+���;JkQ�zD��Vpy���Q� ��N�15SnR[��fvݦ���y5�&�ʛ�;l���� X}캮.g��}J��y���ڷ��X�i�4�-��;��5s/�(�?���      �   l  x�}�ۑ�@D��(��)��0�l�q\Ʈ�kK.}7�hm�[n؄E��y"����H;4 ��9�'�0��K�$�iL�HoBtu���m"l�4L���7ɏ� :d�FV.ާ�C0}L�Hh�H��El��5lBȇ�	�)����|�N�M�Ĕa�X>��dbcG�!>�ƩTr�I���'Du�y��;i��qڧ��bj���|�&Dz�$=���>ޗ��Vk�D'/�iD��2B�ss���K��L����˾�_�X�}0�K�l��KY�^u���^$尴��x:������R*���HXͣ�z�dֺ��#Wq|y�rR�˯�IX�����av��?���?�f��      �   '  x���Mj�0F��)|����F�5�B7���MMb�C�_�4u�LAx3㧙�ܦ;~t�# ^���[�,����E�ߥ�"k�j	�G� �06Ln�ލ����(+yV@�%D(S��/C���`($o���ܺ{�液�eLY�W�Y ����~��q�ϓT�3����Gf�qic����TDȨ�> M�vO��Z��G�p��H���-X4Z  $w�v�ܧmɒ��@����z��%��ì��"��Ǡh�(c9�T��%��T����Կ��FH�(>Q���qAQ���I+��7M�	�"�K      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �      x������ � �      �      x������ � �      �      x������ � �      �      x��}�r�H�޵�)rjc��vH��{;��X%MI�Z�J]�IPD� (��qD?��c��_8����^���<��|�s2	R����%� �s��~�d�{���}��;u��Y�o�$OR�.P��f�T�~z��2���,���,P�p���O��a�V�w�0yR�4W�I����>ȩ	� ]2�HRu��� W�K6i�G�<�ϩ����n�-��x�g�:J��;�g3�\��H�&+��p���MA|����.
��ӯ�p��K�y0Wg~JϙAU��<�7�����0�dj<��u>�ӯ�XU�ZC=�n�N�z��
c�y��p�+qsE�P�U�0ϔW��u�hXY��s?��,��5ݭ�|�9�j4y�"��<�U��r_�0wT�ƈF��쭦ɣ�o���t�-�����Q���G�I?V��E���~��,���m%K������E�S8�����w1޾
���Gͯ��@���,��SY��e�*�C�ӓ��xu�IrO}���j�!��ִ��j���.���|L�<������������w��$O��:��̉N��8Ƀ���[Zm��i�
7+5~����(Jrj�zIDP[9Fy�I}7/��2�hn����,O�z61������t�� H����`&/x\�4ʅ?MÙ�6��'r]�Y�z�^[%��n���*j맱z��5d�*�=mPZ�G뵉��ִR�/?x�jD��5}���0_*z'ݰ��U�Ukޙ�Z+��b�c 
��C�������T��-�S�Y%��u��JЪP�*ެ�DA�y�#�Kv�>�t��J��]�0�e���x����&�?���h��1�0����1HKk6�1G���X��k��VM�>-�d�^')�重?O7�5�D��h�:6�����-Ө�؀G�l0�s�i�]B�W�3Ք��:�4�1�!&�
� �3ðRC%���"MV��sbLҌ�֑�-k<��Ҥ�&Z��=m��	���4��TZ^&3��,YH܇�2�-F���q1����rPE�20�?$�<Sy@��n߬�y5���6m��S�����(�ҕ��<�)WٖYU�}�3KS8���$sy��+�'0Qp��t�Z4;�u�DL.ٝ�L��W�1�%��='�%VĔ�:�G��?�klõ��0[c�V`��,̲$%v����L��O"wk���<���͌(�ƚֆF�6�O�
�p�FO�tե��!VG�N濣Z��	Bpo��ʈ�2[z����6��Y����^�ZQ��}�z�Y��e���[��-$O�4�A*���<-GJ��	{5A{<O��m�'L��sF������j�Qî�x���wk}-	�W;���𡰏� ����׫�&�[N�f�N	�e�M-z���"��4QIαC�8
2�  ��R9��LMû;z<_��f�Ӕ�F��}��K�t��V�|0�E[�k����Q���J/_]�R%R�@� �S^��7c��2s���?K����_���RZj}H�Ü8(L~���#B�>��h�}:G���Hi��4w� R���o^���@\��5M� ���aʌH�UB��y+K�$.-�Ujއ�ܰ�|K�j�x]'�0g9�Tt�L�]�D������3Q[�r$�>��T��Vnޣ����(�o�( �-�i��[�j�l�j5��Nsj8�g�;�1�:��ׅ��Hi%�3
	�hη��a��a4�k��4L����JP���}���� ~�E��{z�5;e��l7�6��uJ,��\�u��k�M�~��j�*�%+�
��C��"T�CD�Ka&��ħ^޷P���7M����������z�Y�w����^sP'��h��_�T��z��?�"1N,>�=����z�z���t�j�[�~\<t�g������k�ZW�y}��?�e�4���A��n��h�d��xhj��!M��w~L����	���]�&$���1)`�suᯂ�
�n�N�?���٘2��I��|�u^s�ogP��v��L���<hM�,\
��Ź�ZMM!+(!ѥ�;H]�R�K�X�PF��!�����,��gd�dvמ##L�L]��E�7���Y$�܈p������ 6�ɎOX�ТYoqw��ln�(��ܼ�Q�hSĴP|�XH<'�=��
z����15�͜��ZA��铼����?i-�vŎ^��!�혴)�D�C��'�7ڮ��K7�#_�Ɇ�2��:��5#�yN��_ʋ���
t5al5j�A�m��r����&��9�Xf���[�����h!�t_5J��Y�􇖐=��i��i����f}Po�ڭz��}����ߩ�[�n�����S������zy�4ڴϽ����T]�z@�xK
�*9�Nƣ��s��ˤr�����T��_�	�d"<�.�}G�>/��,HX�5|o7SZYы�h����dȂ�5ڻ����ZF9�Is~*�EζW��!'�������3]��!�L�r`���Y�x�A��I�[����O�A%���g���M����Uܻ��t�a.����J�Sg`潲�sϴ0���M��F�C1�"�4L+��0�Y���c������u���3=z{�v7�e)zdo�C���I���D:��0YE�#��n�4Ɛ1���5��yP�a�=b7���U,��6"�:����z�������7��k��9G|�T�1h�u�Vo7۝6�Nso�z�$D{ն����؞ܞ��B�tD(�X AX��B@0���0ڐ�"�Z�K�=�oh�CY���oH�#!`Rj+?'-V.!)@3�I�M���t�`.N"��VWy=M�2�waeod��d�^J��v<�#����}YO��%�&}Q�E-%��Q¯�T�<%�'�d����(�^���F3���^d2r�IL6��V�ӻ$NVd'U�[��DP�Yq@��V?�B3J���{i<=����m���j3��ɇ�̖1M��V��,���܌(��6`�$&�>~$�75�_�֦?͈�.���x<id^�]�i]y���v��n�J�)��t����N��m�_�S�����F�
Oem[m�@[_Ѿ8�Oԏ��"{uu9ˬ>�c	Ysi�F"k�<�����2	��xg��3�����	�[�I<�^D(@vlG���!M�@��#~!���f}oG��^�dZ������j��y�V���굞�ҝ���5!9��x���I��+��Qv��,�0��S�)l�!i��ۤ�<2._�zDl)3-]�xz�����"*R�1&,���
�а=��1����F���=H����Bڝ:�Y�y�IA)<ܮp�N��:��M�/���m�̫:��T�Ml��
	��C5IyE}b�G?�����яGg7�ӏ#�W��jxyrz=R��W�7g�|�dJl+Z����"Sn0:8��ړIm����h�!`�I��5�o�1�!�I��N@��| � 
a��iJ3��ጄ�ыE�jt~zs�n���:��x�t�H�[��)u��������ث��>t7u��z�����:��Yq�!�冀o���i�M;��wPQb�l�=1�e�Z*��F�/$�0��b���9^�~������j8]��ewO�ʃ��"m���V	<'0`(#��4X����~�l���w$a�� ��C���q9c��n������1����"��i.� JKLv�i	�R���;�6){��ss���#��>)�~�^��뫛���X^/h}� 'L����y����
�!�I"�3��1�K(Ay��H���tS�򷴝��<!���'j$vYq,Z��l�&���.�7�A��4���&k�ĩ_�~���H��q��Q�V���8���mq߱OM���֜zD�j�4�a
����؜��Jl��ˎ:�v��!���kȔ.=+���hx���7����lq<}�Va�f��fS3�R�a,��L��ê�Q���y����(jSX�a^�e��#<���+�rfﱇ�7><�U���I���`_[P4q,�!�`nVՌ8&�JM4D%]����b-��5#Ҙ�{g�\Q��SZO�4;I`�!�R�LP6��    �xkV������yG����
o.l� �k�q�2s`����o��}��=�w��]����"���~�.=/�`��b�lu�=o;����?�/����~�!�z��ͪ����{#>n9�tĪ�U���;��p_#��#���f�F���T}�q_��W������"jC��E��B�^}�ùt���eLx���s|�V߀�+&�䆋����ƽd{͘wv�=�Or���瞲3����{q�T��ޱiu�CS&t+obהp3b��4ǹ]����!���Q��x�u� ���'�DU�O�9��/]^c���P��\��DM&�m���݄�*�����E`tl�i/T���W��n�6�?h��'qJH\~n*�X�._$=F�� �mP��z)#t� :��f�$9Nj��u�V�e��z@���Ka'��_�sm(��2n��3LO,ዣ6Xi�P8���!�Z�l#�s�fJ�q*C�θd"2���N/�7��4�Bc@t�ܷa&��bgxpd�,a�X�r�A)L4c�Aξ鈗�9�~Լ�Y+V�a�Z��@�$ %('��>p��-
=
v��H4���z	ģ�%��G�#�a� �|(��Q��h*A_e&�CfD.+*]�2�C�џ���<b�X�+D�e׈l����{���ԩ6zl_6H�Լf�W�B��n��'���H��7��,:==c#�ѶBeȞ�́6��_y1É���������P<<�u�۩�{�rm�"����WC��4X����3c	T��@}�[�E�}���(«O�#�{fI":I�t��;�,��b�^I�M�_6!x�T�Ǿ��*@�@5�<�l�p���F�7���J8R �U�|���z8:'�$2���3�a���_�,���{E���53����)�JɚCc����d��P��v�ݯ׽�!�g}��z��n���&����{~$����j�D�y��'�6z�����YbXR���Q]YЍU �dU�)��1��-Z��@�`��#�>�,p��&?3tG�o`�5V�8��6?|�ÈUSZRꇏ��֬i�D��E�L�$ �f��_;/�{�أ��تux��K��t�w$5 E���muN&UM�b�Ga�s�74jҸ�8'��3��qE��$A���""E��,W����D�otr�|#�?�a�X��ܗ4�K�H�R��%k��a��ؗp�!u�;�aO+|�P�����Q/��"�;U���K���ϟ�,�`���Uc91vb@���� *`�� ���M�d��Ֆ��`�{�1�C���7��M3��] 1�B�O`V+���L��U���/�:l%�ZJ���k�:^��m}���Vw���4���y���~�����n�E�H1DJ<��J��^�H�Go&Cu���:u�L�s4�H���ݪ�d�7?^2-���fo,�ҽ����hű��U"��㵶��y���BKY�e�c��m�S�+u����Z�b�i.ApAԜ��?�o�ؒ^�lFv������'5��k�d|9��=UUc�V�虘$��C9Ғ�����D�`�k���{�& ��uRC�I*��G�Cb2�L��Z͛G�ot��׋�9`���5���e��@"���;(0�.~���6�h�`N\ "����^k�h���F��tC(^�j��Z���5%��xvth���j׋;�[>x��m����_�����?xL�5��1���J*l���5��k��9�R���$�L� |��<�חa|��އ���b^�>a�nu��\���������lP���h�f%�+j�Ug��dN� n5�]IG�TX�|an��d�c�<-n�{`J�s���1L��1҂��.�mi&+��blm�<sQ�,���"���i�����U�#8p��#]v�ǂj�@�W�(�J�g~�v������M�q3�ق��D�N1kf\4��F��Byi�ME �,�H:9}5$rl�(c�k
��
c?
�{�4���ud�f��Q� g78���]�	,�f��Lǀ(�4"/� 2ݙn�Z�$�U U3��t$�_ g� �5$Y��W�:��˂�ב�S��8*ګt���{X�iʐgI�X�m�>S �RF������?���O�/�!)�L9F�\ݬ%'%ȞY^�'�����r�2(ll�[a]zi*��P]�a@ӻ��9Ij1����������y��L�궦.�l�S���@h��K܍Y�.h��v���t��A�nH`{�N�^��?��M�2G_;hv�/����U����V�/�:4{�z�ׇ�zj=-����[��s^�N�\x��&"���&�)_Fp1ԞԳG�Y���u� ��Ð
v���x=������\1��O����!�p��o�Y�H �J��S]����mu��.�)��א��GgDΝ��2)���o���O#��/���8��:}'әŤ��/�m�nI��S��3XT��G�)�����N��Q�'����H����!�T�{���կ�����g&4��߽�T��:'�>)JD�ax������l=a	��Z;
�}8�="?�6��&E�!+b�I��H,=�@�@Ċ��ݕ�x��1m�#�uX�
$=c�	)�GK�Vv�w2��OP��>�?�'���31_�ns�!<V�ki�?htj�����/]z18�kv:�f�$<��^��_
�i���<���x�<���T���ku,���To�p�A�-�s�xG'ëkc�H���h���(�<b��k�}#�VVsm�oU��l��z=a|� ���9M�ځ��c����+6�*������v�ߛo_��8c�9,�e���&�f	@��D�XEY]�3����8x��f:%������3Y��Mp�������	�/�6�� �ѳ�D@@�ͷ���`�+�?G����MK����Ԅ���4%��cIbQ�����j��ųpW�����4dV�#b�1.ߑ��V� WƦ�08��M�1Pf�0��L#���0��$ii��6,�9+��-��������#�И�[������a�"��fs��DQP� �E�ۀ���4����<癩p�S�+� lv�F�5����4�䑆!�̀Z��A�a� �i���������p�i���6�S�`gة`kqI������X)Vj��@5ï&�p�h�ON 9���|����:{�Ԅϑ�%LF�TH��j5$Cs�h���7�y�ThU���.H��4ڵf��C��W^4���z��#rz��i<�ȵ��C�^�`���Ǳ���:&Z�Ah0�
pw�0uA�;P�`/�8��A,3 �C�Z��k��O�V����اm��ӊ���4Vo-�$�@�D���6$Ǧb���d!�!�@b��D& V!�M�Aٮr�L���a�$�"�lB��ɢ�qI] }.e�N���b_�
!�~"v��hO���g�D;'����S��|̆��.ܦxC	��<OR�U��)�M,BOă�0���fN���]�������Oe���{���j_�A˫�o�=��oS���>U���<�o϶{d_(_:��i�)�
1����<����hMx�%�������ګ�J���X%iY��!�7�c F�_��� ��� �$f)���'�QI���:h V�Z.<DP�l*��x�VPHy8:r��5Р&70@E�&��8����9d�#$�IE�4cp�Ѷ�h�~�E&G�v$&Ȱ�FD�1z)�~�=�e}��� �n�e�^tܷ��^�Q�y��E���>��3�x�@2�Eaq�A��s�;�Oe:0��B�����0�8�K:6�e��@��f�y�E��֬w��FEb�.=���X�cE�Q�m,bO���'`U��Ud)��G)H�1�?E���t{����^��<�a���O�*=�s���~��3h3�2;�K��ƫ �#l��[5�-g�;�2��b�K��Y�Ɗ�;�Ϳ��ux����� �B �ʂ DM6��Y�6��:r��e���S�uo��$�J�ȹ,��    ������R���(��ś�bn"��@�B�9�-k �n�1'y�:	|��8O-�!�7Vl�	V��X-���@�d��ldϯ�dw�L2����bB�Ec�P�2F����5PV�k�aR�E*NN�D�;��4 �^POY���9 \d��6�%�=����	��-�����E�0�O�ײ�ڌ>`�)��
j�ӭ�"@&����!�;�N$��k:?�O2*cLz�P���h��o�(4����ck�1_1ߛL��8����G`�o���#&�I�U8T����\������y�yC0K���(���	�O�/g�y��FF͞�mڝ�[��^b�{��pa���H�?9�>�m}�s���W��A�V5N0��q�5JKj��4;�%G^�_�]6Z^���Û]m�^벶�h��Ɗ>�g�^�4��ssӈ�
t� W����^���%��E��PzN�886�_<,K��(=�c�0ym�bK͔BM�A��r�$}t�$�ª臋^��Y�I�>�BE�,����O��`����f2�'�v���`�?�~H�����+�F�4����'���Dvr;��4���	����8�pT�kx�J�,����#�K�����g�����՚�^��k��.���5z�F�v\�p<9�=j}�_�Ԧ�;��$���e��!'�
�&�i����.{��O�V��I��sڭ�s��l�(�9�*'i�I=e��>3iwA�f��w���q-�X�Y�d�X��b0ϧȝB<Lԟ�d>�-��3�m)�b�Z$F�EZ3;~}��x}G��CE��{�����y� �t3�r�0��"��p��
bڶ���1:�z���}{{\E!�6��ω�<�:HF=�3;R���{`�E��,��,����&�m��t���y�@|��#��gU�x�h~`�q���E�$�Z�B6)P$>�v��e�)���A9c�[�2K�P;�(7�6 ��&rm��,X���c���q��Dg͖2�Mr�ɉD}.C˴�h����˂hQ���d<����A�rv}�uM��dV�?q	f�gQ! �&?�uH^&�訁�G�����Z��Ak?)�t�}o�Ź�^�������Ko�|?�;{�bo�����Q����0Z/�)J䰗�\0���vG����T�����5��sv��|�Q�Ŭ�V�����!%����kY��h]ub�H��������e��u9>�@F	G��A�`����h�X)Zʈ�Z��h7QO������N>U��գ���¶�g[���o#k�Z+�������f�>���0�Gc��]�]�\�����x�i�||5B��X�n�}kz)����k"�izH��0)r�ڠ�'�0�{��E�_�Q�MJ�hL� �%9�E�������������� �H����6��mɚ�Y'�aHq�wp�;br��8�6��P�)��e�e1[u���@��R�3�*���������9<���j�!��HhB�J4#	�,ӟK�c�Tvk������/u��2�eBpm;	�qb�
fQ��VC�P��F��!1@`oK#ܷ7�nA"R�Pq����|��2B�.2&�f���ҥ��.���u�ĸ~9z��?��-�?c�H�upD���tE�s�D,#%���ΎYU�z�&.6��яtAV��a� !,	�Q�u��/C�2ժ��ԏ�_k�nQP�����P�!����J�8�	I�KL\���)z�FeP��Ή�iS��g'2�d5,Yk+����p�Ԙ#���i�s�Z��~
Tp�ȥ���E)P�~���{D���S�tJ0�!���J5Z�m�0�_�A��̉����V�W� tƴ�%*���ꊚu BF�G���ԹE0���"	�Q��X�Y8��f�k˄3���a�K2����٢��.��ZqJ6�;���fg/����O��m��\f�ig���i��oyy������@e ��y�d�dK���-"�Q�"kgK=H	�W�3$нL�|�3xc"�h�.�!o�0�A*����lF�\�嶮5d����ع�"u�]�\���K���9�n��o@��h�0,�;�PF�G��)"w����&]'��"g��E������^�/�8�O�8t�鵗Qo��&/�]k�~<>~�[�T^f׿I��#҃�G'rA�}Ly�V�Ġ���oUb�[pX���YU�+սpâ��8���h�?���\�p�؜����ů�>�1�~�~S-v�c�q���9RS�oS)G�w�>u���88�U}��z�����x8X	#yP�� E�m�U�������K�u�'�A��-VEz�������.`t�<r�qߚB�0д+�c�678
��C�u̎Y�)�FNm�8i���Ni
������O������?��[�V��CT"v�|�%�%�[~,n*���&F��ri
X�R��ꂿ�� �>)RB:̶�)-xf<b{ITğ{�H���F��lw��D;�;h��v����U�v�&���{�{�fQI�ź.���G�'
�0�H��(�z�� 9�iUS���r���ZDT�85,�#Z'2�s]ޭ)��c8ϗ�����m9�DIW�!]��^h��-����:^������|�k�	t)M]�?�=\u~y>�U�������%��.<'���tx6���r���2�A����^�Z�Z���O���<p?��P�bZ����^����)�ٻ��4�6~�ӎ�}�����_H�(E�_�=�>���}d���C5<��E��V��?薖�9�wQf��R�����ڽN�_mxwɧ{�>+N4�`��l�D������u�����R��B]��WA}W�B�C8�҄�-8��(en;�kM������]�߹Wz�H�}�z){��*��\��CH�/u�f�Az��Gy�qx�TvS�tH��A8�J�v��d��#M��3�>��uE]o�_6I6}�}��T��h|��3�A>���G�c�=����l�ߧ���q@liʸ���)��a��2)�ʓ����}z0}Z�-�]�՚���	$���w����&����G��D��{��H��ߵ�>�.C��,������ZigR{�z�t���V����4Yo� =�]�@�.D�K="��OJ��H��c�E'�ί?c��$.�j�JQ"��E�Z�_�#%z�v��0���_�>?��u@�Z:��bVQ�Is� ��QƏ٫�_=y�W��/��Gpe��I���.�D�ڼ��a��O@ N��\�����œ%�2"2M��)V��;���������H���dx{	��9x%����[(1�X���� �ɱ�ҁcݑ�kM&��3�ũ�A�Q�	;�j�T�YӍi����d��0@���X}�t�t9�*H�`Ř�D�^�MF�\���vLC��< $p~C��s��H������\�!ܰ�tK��I�I?b+)Z��tjK��q�6x(f��b�.ǧP�>��&��ȫE횔ώপ���&L��f�.l`�M&&��Rt�g�����F�)�#�I]$!��;1?�9M#���z���a���	��(�@����ݪ������l��SE����KR�FG#!Vt:����#�%��7ER��t�(%͜�*�/`����;�VO�
.�-GV� ��x愌y]��>��d��ɥ��B�6��"	�K3�h��p:��2��ԕ����A�$��L��D���(���kn�?r�H���a]��J9^�����ѱzw6���	���w�G�g|������#�:������9�Js�ʌ�3���V\"zA���\ς����?�"���ǀ�s�ċp.��c�?��e�8IN���@��mb�:�3����B��#�_���	/ �R�tľ2a�b�ɱV\����t%QS8	j�t��+�3W#�Y.���ZoRbEP$EA4D�.Y�Sn���^���h����.v�t�y�F�W'���m7ޤﾀ!ұ��w �9�*���pN{��    uS��>�������$��E����~Ft�x�I��0&���fjԍ��+.��@����<s�0/�!M�CmL��ѯL�6��>.P�ϲ�������'��:=�N�\�0C��CQ/jc�wL�����ˮ[�������&��`�����%8���~�����y���{;���g���&�x����k��w�©�����5i�o�\��B���&K"_������-q��&��2��0��J�y_P(�$�l5�
�<x�BAN9/QA={e.
	��k���p�-J+|�1����Xޘ���)1{�Z�P�=/CH�.
u�Y�� e2�&��O%nrK�cɠLF|D
#w$�>�qK9*��A⡢�r|XO���q:$Q?�3S)ι�M&������G��@}��9�l��t_䬿/U�(|	U��z�;.J~ħ��Q$�>)�8:���U	s:����MXԛ�F���򆸚�4=�	�����}��Uo��j�;���Q�k</G~���3���~�r$V��+,��#�Q<����3�W�G�"������r"s�'����r�,^ǨS+.͡��hE;��H:��7ΑGԄ�f��{�����׫yޫ�gs�7'o�Uw��<P}��]�^=uk�[X������Z�&��q6���A���0�ɨi�ჀBAUl�Sg���bt�mO���ҡ�}ZY�b�t��eJV��߇�_0��x�����̑~H����T�6��9�R/BE�nD(X���*n����!����=����7�up`Dq�/�,qo�F۱�܌��"+D"�#l��B���:���bؗ	6�Z�Q���Q�3=�KjL�T�4ϚK����j��D�}��p�i���}a/L�;�A�e6�O:}��*��P���&�������ܥ�<�qa1�5D�"$m�SJl.Mq��^��������\q����&dKdypq$�8����@2@Lxǟ���y��Gν�$��꙲W9����>�)��,�u
� #%ͅ6������r�]������H2Bc��z�b���x'b��T�� �39>*�w��$w����N7��u9y˞�cϕ�� )(U4���@�(£�����:zdT`�xe.dYNe�T#QH�b�ٌ�p�|0�����(��a��*Q|���|3O������W���\{�Zk�\k��u4�*���6�� �ҥ/����t�F���~�.�GO���k7?6{�rxϠ��\!U#5�tl���ߪ�z��C V�ҡ>�I��N��W8��mT4��u���
��l8����ٙ�4^��B�����3��ƍv�$!xj�2]��[�D��a����1��3����I�3��Ɉ��"�y\��t�~D�.<&M[B�V�����sI��9}��g�M�F��/�o J��Ju�rB�oN�م�7қk�4��ʜ��R$���')�U�$	3�7'1�k�`��n������Z+C'e'c<-׏�jT�X����f��LQ��I�#Q��d�"�/O�v��c	�,�퉲�e$x�N�#�qY��5pѰߝ:��貘Na�4�mg|���g1^`*j��e�z��(i����'�0d�o�Ճy���i���-��@���v�:��q���4z@Z��O����3'�x�F����	#���)M�������x�z�&�Ӧ?o�Y�=�����oH�� �_������h������p<�0P��g���q�z��;0+e��Ls}5_�$>�nͅ%t�F�=ʯ	�%�"��������vTy��X�j��ᠠ��XptQ�,
WZ�((���jxx6RG㏣+s.6X&�:g������KY��e߄�V�~��#8�~kKF+�6�{S<R+�5���筲�׬��6\jMZ�@"��	�l9�����r��Ľ*eGs���ݵ��fxvz��R��%�x�%6��f���2���Υ�|z�"�/�t7n*T��b��&��c����\[��Ǘ���o�V���m*E�/K�4hh֋����*����8�3p9|?rG�M��t�yŠ�ɡ���sWg�2��zH"�i�o�={�./�Ι��V�w�b�@ow�mѸ�m��������B�\���|���Ċ¡����
Iվ���:IT k돿��-Z/��c����.�����4�Vv(���mJ�\dB�m�8|�kg���/��h�xF ��Z��uw��s��$ �z���62����m��/ ��S?8A]p��d��zٽ'0Ȏ��qI�;S}��6�k�^+�$7s�t��W�9���Ƥl���t�"�|3���k^Z�'���ץs�2}s��,8X��!=��q�x|�S ���f��W���u>z{e>v�x��%;��u8���P�� V΃��.�M�
��������E@�=2�^��ue(j�<Mlu��1�-J˳N�Z�.Qo��pV���-YS3)Ob��ݑ@� =!��G�r�fl�wa-\�1�Ku1:M&�+b#�}���N>���L�1��+���99�iez�i����pYC7��ʹ�N���Շ�:M�������!i$qR��A��0]�4JA:k�XY�C���_Wf.RiD�|�݌H.}0^#��9��p�[M[̒H�/�M$�����G�2i�f#�҂zM�j ����T,|�]tT�^����p�'�=�M^�b O&�����M���[]��;���f{����F��|�[�l���ڀ}��f�˫���x��]#���.�է?N�i�������ԕ*B8hAn�4Z�9�\��da��f�
q�V}� Q�˿UJ���S�́E���t�Li�s7�<>Jl�ժ��������_��_x�	����������?7��#�#t�9��$hf�j?���;#�b7���S��e���"�2�U�B�R-�����Zr�o-�˗TSֵ�ٴ�w%'��2���S��|Y�5�vp�es��(�����M�@���L)!��<�X���9����W0=��W��d\^����i�1ͺ�k��#�.�=`+�K[�*�e�����G/�A��ց�nV�p�M堉�,�wã����ݽ��?����Z�)_�}ݣ�5u8^���O#�;���N1WzwT���$R�|��ى;�Q��Km���=��W�^}����;��)~�I�:�@6�~]&�LC;�j��e��|YX�/�?y���2��z�ͦ����	]dD#{A�i �J�v㩏��&Cř1F�d��y��K�1M66ؗn6�
�����B������{�h��}v�)�F�A�K�Բ/�g�e�.j���D�[����)���+��cۈ�įʨv���#�yp����`v1��t[Tx�9��(������G{�pb��^b��B�揃Y��o��(Sh�g�$�#Qyæ�h'�5�qi3d�M����!�&��$�&ìDakS�iq���_�;a��IQ�[�. ���?���ƕ��� sV�C������G�}A��$��Xp� 29�%78�y1Wֲ�ȃ3�D܃�@��"�'1�X��iž�h	;n!O�G�3�>iI���>��]��^L�I�
�>�S]Jvk��WT�8>�$g/�.�[�0����[irsz�~�G��V��n��J�+�9VH����;��ׁ��_3�� �*�HlL�^Χ�NWH�'l��)�F+��
#'�?��3/.D��C�^I���d'�%銑��)�>�0�KqP�]����q�|���NLnT�Q�z���{Q��{�N����W�_�������Gq����u��z��3� ��U��b� ޤ�U��]Q��N�l��>�n�r�^S]M��a��E��9j�V�Z�n�JY��'V��Y|��:`[���%��7gקlM8	%�0�������9Ŧ�+�q*�%Vp�R	��"iN)I���.��n�,(��p�Am#��*�V!��v�V��\z�$��{ކ�rL
K2�*m��ňk\�J(����"��W�����˲�%"�н���+��F�� �  O��q�b��]�S^�E�C佺Ʊ1U��l0�Y��,3bPCn/E�8k҅[o��������f��?]�&j�NQ�O�N���$�Y���ʷ�P_,/t�\ԲT��) %d�i���h�:����� j`�yQ�����q��$�-�v��x��죲Qq	��6 �`�*J��Eױ`�ot��k3ufk���8)�`�0_HR>/0�)�\���C�AR��w}-��N�g���c���<+I[A�)d���l��^��jv�7�!5ۼ1o���y߯�{�N���nz���賰�~��o�h\2t�T���rR��U%)���)ݫ���a7�Ygë�#�w����􇛑:MN�_(���������	o���ɠ��%gF ���*���,w�]�t�.i�o�����f-Ҁ��~j;o	�9}����������m�EI��{�~m�K�Tmp�m���M9�m�B���#veh�n������n�Jg{N��1�Ǎ���s���b��d��H���Ijp�S�����5��2�%��0l}�f j���z��	ۭLҜ9���C��D-������h�3!�(!��P�.�G- �cNH��0��To�IA�p�付z��aSK�T����Pϯ"Av�#k��_2/��a0�ir�[f����>� {�a�d g���h��`EHD#�����ʯ�NNX��m��5���7��aM�� Yd�t+��L׾2"�q7	6�Q�wf��ϖ��2 ��S�
\��rk���B���.�����������㪤�HVc�3`�+�.qE )��'\*	"��N	����QM�ka8lX�`y�O��hkc��%�e0vkf�3W����*O�u�'I�����g���@{9�i4G�F�-�0=��ғ:X����H�H�.9s��x�b�R �l�����$����Γ�R���u�����FG\��CU�J��Q۝zg�(��� �cH?ß�l`�,�z�˰++LIX(�����G.��L�੬[�
&Eu�e�P'�i<U�8����r��XL+pj�x�A�-u�=���r3�C�|�Gw$Ϯt/T��	5�aե7��[�%�,mT���.�T?�:�9ޠթ���s������)��A����K��~��o���v�:��-����}�Q���q��������>^]�~�(N)�]T�m�46r2:�ě��=9�Nec�o���_�¾s�ZՄ�}B8.� ˀ�sT�4��D�I�R�5���y�vB�8�4�s����Cp�%v��;�v;^/Fl�����R[t��&�텕V�n�@8w�<&^��jd�;�{��y�M0��z��)۞v4��"�qQa����qpH�9�#��r�e�H�p0;{��IR�lF#�Ņ&��Y7j�$�+.+ɰ����}���R<��Ay-$,�%(�L�G��&ɋNǔ��8H��ԇ����C�&x��	p�4h�!��WLZ���-f�����4�C�8�0���M�H�GJ'8b�Y��:6b~�u���I�E�l��s�̜MJ����C�K�4� !b�w7'�H ��PbY����e1 Ck�Et�g���כ�c�)��' Sr�����u�:��.ʏUt�A�|�7�⤎w�tcOz�Ƹ�\��}��(���uR=�&5Gv!Q��~�w�W��x�Z�M�������B�Z�n��o����=T,|��{$:ͦ��z����������� ј�      �   t  x�UUˎ�6<�_ѷ\a��c����%@�Y`�=m="e��"�|(��jJ^;��,����b{�mN�f��m��!ڑdJe��w\��$�6���l�m.���$�&�$w���=qO9D��lyy���E�����G���9K"�y2<�[I�N���ܹ؎�X�|�5p�ӄ"Y�N
��M}���H�cb��ƒ#
\z=����۞��,����6;�jSF�Cp�1� �)��9{IIt���$����Ƈ�7��q���Z��_#'*���^L�Ξ�{�=+-�%���\"Vo��APm��j+�($^�*9�ȳ&��[�����P��j���v0�@�%_�ZCpR4��sH�	]�d���sAԝ|8���=N%�'o6�����T�O���w�x����ϙ�h��(�Z�5W�(o���`����]�����6���@��3@.H
6�~�FU�C�w⽌-hV��{��!u�DϪ��Q!ik�x��ܘ	�� �m���j�%��{L�fQ��6��\����/o.�%�'�qW�0��Q�`��Κa�v��4] �j�u�� �0<�Q�2�A���-����2�H걎�����0͟*	v�)6��8BoQ5Ǡ~�[9�u.E11�3�>Ǡ�tއƂ`qj��I��;Wԛkk���au��d�Xo��:��̣*W'��~�]�C4�ӡ9m��#ws:5?���/�n�lw{]w��.4h��5���v����û�f�40&��V&m��j��ta�������x^��>�)9Lߟ��%OX\�@����=}���t��mv#uWr�+�^_G?M�1����� O�s�9��_,�� M1P�9>5��ڞ�����m6�� X'@�      �   �   x�}ν�0����*z�����Q]LX]N,?MhI@B�{%G����G�DŶ���p�!8��8W[�F-$hM�J�[z8e��L=\(��S�Jː�(P�*��Ryc��e�V�� 1m Pί����k�����ٺ��m�]tl����4Z;���K���;D�      �   �  x�e�Y��0 ��g�>�ce{ ������$�*EP���w_uܝ=��/M�)"HpC������,���CD��E;q�����91Ĥi*UD�Z'�H�J�6h)u�����h�$|���\���&K��I�z����PT���8J>������/_~��7�v�}��[V��Ahpѻ`VL��]�ϓ�dr�7ɦ��X��������K�!r&R�PA���,?�o[H��R��2,	΃���=�O��َ��<�����ǅ���i3tr��x����l����48�{UD�Ƹs)i��V��,���c(V ſ;�?AV�P(D���v���E���@ٜ�s	���MKۛy�r���ŋ���ˈ����y��E���a<9l5�|��kk}{&��v�a73�	��h��V�F Jf�<	��}R�ꤷ��������ޞΰ�`r�ܱڵR� ��5���:�;�$K���������:P2]i�e��}�\vF���V����읓��U쨥Ȑ^He:��~(8Q��U�f�C������Hغ�4,A����An����PQ�_�됊��!z�����VKG��\ _��U\��,o���i���t�;�A�i���2�����	����J�'�~�      �   �  x����n�0@��W�`9
�!�(�&4C��#u㼈'�4��<��4+tw���ѹ]�w%�]=�#��$KW���j$J�%�(��
m�,�)8R���v��p_& �)���$(U�����b�0�"�� O��?���=/z�����w�6u�7��6v��g�㍟��go卣���d=�*?��o\��c$�w_��ڇ�v@��P�T�0Ƈ(ń�"q9�ȠYxS^xqφ����Ã���ܧ��X��ؑ�>u{m.&[��j`a���u��L]+C@Y�I��W�w^"%�I�/�]6���<�$�����7�;����x%���תH"s�,x2��(���,�|�Sj�
D��ʅ5�:7n�9B'��Q���� | �(�p     