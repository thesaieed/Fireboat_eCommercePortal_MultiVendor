PGDMP                         {         	   eCommerce    15.2    15.2 y    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
    name character varying,
    created_at timestamp without time zone DEFAULT now(),
    modified_at timestamp without time zone DEFAULT now()
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
          public          postgres    false    225            �            1259    57948    products    TABLE     �  CREATE TABLE public.products (
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
    vendor_id integer
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
    modified_at time with time zone DEFAULT now()
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
          public          postgres    false    234            �            1259    57959    users    TABLE     �  CREATE TABLE public.users (
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
          public          postgres    false    229            �            1259    66101    vendors    TABLE       CREATE TABLE public.vendors (
    id integer NOT NULL,
    password character varying NOT NULL,
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
       public          postgres    false    231    230    231            �           2604    57968    cart id    DEFAULT     d   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);
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
       public          postgres    false    227    226            �           2604    57975    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228            �           2604    66104 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232    233            �          0    66079    brands 
   TABLE DATA           D   COPY public.brands (id, brand, created_at, modified_at) FROM stdin;
    public          postgres    false    231   O�       �          0    57905    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   �       �          0    57912 
   categories 
   TABLE DATA           G   COPY public.categories (id, name, created_at, modified_at) FROM stdin;
    public          postgres    false    216   N�       �          0    57920    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   ��       �          0    66112    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    235   &�       �          0    57928    order_details 
   TABLE DATA           `   COPY public.order_details (id, user_id, total, payment_id, created_at, modified_at) FROM stdin;
    public          postgres    false    220   M�       �          0    57934    order_items 
   TABLE DATA           X   COPY public.order_items (id, order_id, product_id, created_at, modified_at) FROM stdin;
    public          postgres    false    222   j�       �          0    57940    payment_details 
   TABLE DATA           `   COPY public.payment_details (id, order_id, amount, status, created_at, modified_at) FROM stdin;
    public          postgres    false    224   ��       �          0    57948    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id) FROM stdin;
    public          postgres    false    226   ��       �          0    57959    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified) FROM stdin;
    public          postgres    false    228   ��       �          0    66101    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    233   3�       �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 166, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 110, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Order_Details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Order_Details_id_seq"', 1, false);
          public          postgres    false    221            �           0    0    Order_items_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Order_items_id_seq"', 1, false);
          public          postgres    false    223            �           0    0    Payment_Details_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Payment_Details_id_seq"', 1, false);
          public          postgres    false    225            �           0    0    Products_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Products_id_seq"', 60, true);
          public          postgres    false    227            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 24, true);
          public          postgres    false    230            �           0    0    newVendorsApprovalList_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public."newVendorsApprovalList_id_seq"', 20, true);
          public          postgres    false    234            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 124, true);
          public          postgres    false    229            �           0    0    vendors_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.vendors_id_seq', 24, true);
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
       public            postgres    false    226            �           2606    66099    brands unique_brand 
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
       public            postgres    false    226            �           1259    57996    fki_category_id    INDEX     B   CREATE INDEX fki_category_id ON public.products USING btree (id);
 #   DROP INDEX public.fki_category_id;
       public            postgres    false    226            �           1259    57997    fki_d    INDEX     8   CREATE INDEX fki_d ON public.products USING btree (id);
    DROP INDEX public.fki_d;
       public            postgres    false    226            �           1259    57998    fki_discount_id    INDEX     K   CREATE INDEX fki_discount_id ON public.products USING btree (discount_id);
 #   DROP INDEX public.fki_discount_id;
       public            postgres    false    226            �           1259    57999    fki_order_id    INDEX     H   CREATE INDEX fki_order_id ON public.order_items USING btree (order_id);
     DROP INDEX public.fki_order_id;
       public            postgres    false    222            �           1259    58000    fki_payment_id    INDEX     N   CREATE INDEX fki_payment_id ON public.order_details USING btree (payment_id);
 "   DROP INDEX public.fki_payment_id;
       public            postgres    false    220            �           1259    58001    fki_product_id    INDEX     E   CREATE INDEX fki_product_id ON public.cart USING btree (product_id);
 "   DROP INDEX public.fki_product_id;
       public            postgres    false    214            �           1259    58002    fki_user_id    INDEX     ?   CREATE INDEX fki_user_id ON public.cart USING btree (user_id);
    DROP INDEX public.fki_user_id;
       public            postgres    false    214            �           1259    66123    fki_vendorID    INDEX     R   CREATE INDEX "fki_vendorID" ON public.newvendorsapproval USING btree (vendor_id);
 "   DROP INDEX public."fki_vendorID";
       public            postgres    false    235            �           2620    58003 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    216    238            �           2620    58004 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    237    226    226            �           2620    58005    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    236    214            �           2620    58006    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    236    216            �           2620    58007    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    236    218            �           2620    58008     order_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at ON public.order_details;
       public          postgres    false    220    236            �           2620    58009    order_items update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 7   DROP TRIGGER update_modified_at ON public.order_items;
       public          postgres    false    236    222            �           2620    58010 "   payment_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payment_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 ;   DROP TRIGGER update_modified_at ON public.payment_details;
       public          postgres    false    224    236            �           2620    58011    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    236    226            �           2620    58012    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    228    236            �           2620    66089     brands update_modified_at_column    TRIGGER     �   CREATE TRIGGER update_modified_at_column BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at_column ON public.brands;
       public          postgres    false    236    231            �           2606    66090    products brand_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT brand_id;
       public          postgres    false    231    226    3292            �           2606    58013    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    226    216    3268            �           2606    58018    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    226    218    3272            �           2606    58023    order_items order_id    FK CONSTRAINT     |   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 >   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_id;
       public          postgres    false    220    3275    222            �           2606    58028    payment_details order_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 B   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT order_id;
       public          postgres    false    220    224    3275            �           2606    58033    order_details payment_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT payment_id FOREIGN KEY (payment_id) REFERENCES public.payment_details(id);
 B   ALTER TABLE ONLY public.order_details DROP CONSTRAINT payment_id;
       public          postgres    false    3280    220    224            �           2606    58038    order_items product_id    FK CONSTRAINT     {   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id);
 @   ALTER TABLE ONLY public.order_items DROP CONSTRAINT product_id;
       public          postgres    false    226    3286    222            �           2606    58043    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    214    226    3286            �           2606    58053    order_details user_id    FK CONSTRAINT     t   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 ?   ALTER TABLE ONLY public.order_details DROP CONSTRAINT user_id;
       public          postgres    false    220    228    3290            �           2606    66139    cart user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    214    228    3290            �           2606    66118    newvendorsapproval vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "vendorID";
       public          postgres    false    3298    235    233            �           2606    66124    products vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.products DROP CONSTRAINT "vendorID";
       public          postgres    false    3298    226    233            �   �   x�u�A
�@Eי��d��4�V�����Uh{l�ꦅ�����IPwe�2��h\�D_%
A��v���~��b"^5J�?"��Jb���t�> ��'�G�)������T���3�q6�ٔ����P�����Sŕ`8ߦ�l�E2d��8���@s��zBX�,_H��]�s���N�      �   0  x�}��u�0D�dn�x�Z��C$YO�~bdSk�Єe����/�X��lC�A�04�6�3�LC��l�R!��3Ax���d�>�A���@6�f�'�	�)�$��)aEp�d>����ź�*+���C�����`�\�� ����MO�O�T� �Rl��ㅹ$��DE�����Y	��ݘ����:^]��H��̯�{I�b_7V�A�&YW �����K�L���~��A
���7�\�R�>����[@��#�:�]7��\FÜ��@R��@oN�J����/3!��      �   @  x��QIj1<K��X���Z}��\B��x!16��?m'��L@�ZT]�9�����.Ϡ�;DC��	���(Rx�����#3��2qR�
u"ϖ�H�#k���p���bBnB�&
%_eh'i�53F��2׋a��u��95�Y��$�Ԣr����(�bX<�4�\�Hi�����~<^��;B2���2ѫy8v��rm�O���������W��'W������R����ŘRa�1<�7��D��J���V�2r����a��3�%���߁\��Ӯߌ�t� 9@����R���ڒ�      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �      x������ � �      �      x������ � �      �      x������ � �      �      x��[[r�H��f�"�?���@���8��eYUzТ\*wTD$I�@ F���Y���vf5���{3� ���>&�J�D���<�!�j���Z�_m1��F¶��W�7E��M����g�PE*3xكHy���K7a.E$���k,���$�s�fI.�<Lb�{���=&a�K�I����R)�9}���%E�g;���M��x".����]-�j�,��XN�c��'lg�Mz��hh��y4�8C��י����q����حQ�U�Q������?r={4�;�����s1Nݿ..m۲���[�ni����`�Z��q�K������D�&Ƀx
�X�����J�I̢0�( �9��$��n�z�hV_�"T��+���]$E ՃH���_e���I1��z���~�(�Ĵa���>~����i�<W��O��V�\ij�M��m��Ϳ�q�`s�6R�J��}6�>^� �Du�u��]�a|�?�d%O'L�&�/�A��J�E���=<v��^&�kѽ����s�^��,L�x-V��V�7q�I���S�ҭ�9���O�D�-N�<8��Y�����|#�&$��"�^k��B|��x1��5� �F�Y��^Λ����:&�a
�����n��&iɓP���e�G����@�Z��L��`�5�:��`��cMzî3vz�C�;�w4�Gǵ��7�_���ei&�5h���-��q+J�ޤo�b!s��~Zz���CŞ ��8=�|s�O�b�by�_X=@��ޅ�Rv	v����p��m��G߹�Kpݡ;��K:,Hs�nW�`H��f�� ch���{��2�;�4*�8��8'�q1�����
?��l%�+���g��&b�;֣"S�m��O��
�$`�L`�*/��N��N��:�"�J�O���g�迓�yAF�p46ɽ%�
�[���]�mᑩ�T�8��x�'p�Id��~H�����q���W�@�_D)�kT8�xÀ�{��Of�$N��_�rB�\v�Rp��~g���(��xYʛDr.kb[,�E�f��UĨM��w��d�����S�ֵmB�5��鮏`4���;Q�O^���cS���K ���������-��訍�45r��
��C{�:V�P��j�I1���9y�s���U��J���p`�>���I��۹��7�����Ŕ�6lp�)>-Øݍx�sDz�Oj�ӗ�g�gR{�X�@uE��_d1�^�
��«F�֎'h�`I�cLF�L~)B��9�:��]1%Kʵ)�0=��\�쑶����le��NJ��;v�,�i	>qQ��TI� �0�GA�p:s�,^f�?/���{���?�%�E�񋭇;���n%V�1��1��Ozn�[0ɷ1ϑXCׅً�����jvɐ�m@��C�<S����N���,�%�'�d�\Ԏ�\��A�`>c$hT�'x�J��.�t~�oD���BZG�s�#���7p
;�c�ٹjä��.�̃
iU��O�w�e�ʤ�<ݰ|��(/50X���]=+cz���2�h~�W<y魊s���������EL�݀���!9$���A������S6X� <�7�F	m��:����?`�����ޗA��G�=NIZˬP�6>$���FxK�j��f�.cZ�A��p<���8:i��T�+V��\DU�<��"֐��EA���	��;�Ǫ��J|�=��nR�+F�%�i���J��-�AnbC{}�{	�l$�=������}�����K��v��t�j��]@{,����*!���sv���/r��3��$gW�üq/�	�r1�|���tqV��n��>IƢ���(v�K�L���'g�+.�8�&E���}5�|�<��٭%�ps8�:I����
��eB@����3l�1�F>��CG�@�R�xD,0�B/�ۭD
�#N�A���h	�2�wrj%h����B�����޴��+��L C�;�Z�A@��(d8>�$�>޴Iƅ���Ņ�$�k"�ԧT>Y�褉��EĢX���%E���gE$��@�����"3��ӐE[8}k��{��U�B��G�Yh�iBs\nEU�82�A6� &��4���G/��e�*S)�1��cZN���A��x�Hά��q����$Y�A���e� ��țe��x��&�v�;Jh�*K��f��}[*��~�U��d��p��lq`GT��RW��^1�I�s �Fϡ|8���A-r�a��?��#���ꍬ#Ճ�����ӯ������u�R<-��α[TK8��lHD/�S��Ϊ��jE���w�(��ænV+8q�d��9�^��ܔ��w�:�H�dE�xX(��;�-��u8�1��ʭ��-�F�\t2�8:��aگ*���U?&QQ�@�*��KQ����JPa*��t���ħ�A5\^����#�E�P�;eN%�a�]�a�Q_���ؼq����16b�jj��g�'���?~�:0h`��Ƿg�]_\��W�\��������'N��������6���u7�̢JE��jϵ����\�#���y�$�VJ��K���F�X��I�)\�Qka��ï{JTk|��6u�:�P�JI
[�FH��G�'��k%���i?T��Ym��vk��b+�=��v7D �I�? c��!߰��6a�HrL�|ۀ$���6�9ȴ�!��t��~UFox��'Znt�	/Ng?��Է�� j�a�9�#-9����r�x#��/r)#C�8��a	�ޅ[��qT��#N�72��i�U�W�G�M��+fW]S�z��F`h��`�5�z]�q��a>|K��Pҷ�t���W�Ի;uIs�ŏ��-θ��D)���
��' Fy�#�B�I��S�r�	$�E�d��V��Mhi,9M���<�^�Sf]{������3�Ͻ)t]]'����%~�2e�a[+�bU���(ͪ�օ�
��|<�:� �g��諩"��4�"�ȉ����P���rD��"�e��� �Цd�1E�a�i\�>,T�M@�=��0���T!�}LFc��$7�'����2ң[����6����<I���
����ֲ�{��i�2+�n0v�AzPd̈��ʓ��{a��l�[&�(��dW�¦���o�H��k�ˤ6N�U��8�� ���9w�]���=����OP%J�<0�{ p[^U%=`�i�T*BRd�!wO
�����9��p���J��^��h�8H���g`8ߣm2v���9��E:�m�,K�#�[&���\4�)3n���m��}�	��%�
EEf��Av���J"�⥖��L�*�Bs���u��캌-�=A�`�x��L�U&V5�b�@W'���z �d
�R�!c`�����!h��4��!�=�Ʈ������b�	��A �:^R	ݠ��)W������aD`Z&j+U��zC*������g�{�;��F�5�Hk���+��ãNk��s�Qs����܂K��	������@��U=�'��N�����ƢQ�@sN�D*q�Á��먆F����U����=5�? � �k5:ˆ6 �ܔId�tf�>��a[7֦F�L�Y�h��l�U�V[�k���˚����ڿ=!es]z�+@��"M�#Э�o��C�>P�۵��H{��%��ʊ;��;�L��A��,�z`Y/TVz\�﷮�G@ޜ�������8�C	���|[	~�^ Y�-�8�;[lڨv̑���V�i�2 ��J�H.�����P�F!��W�c�I�M���,�B!M���L�M�اَ�3E������_ҷ�cg莿�y��5�࿁��_�����ǃ~Ⱦ����54!V�m��Qp��l�&����%�Sj/I�#�^�2�Nڕ� �1ꓐ@xY�L����e��&<�H_�����n��<]
���蘕��]۔�J��,�[�a-�=��ϩL�{ntl�2�I5n2��)h���E��7<���
o8q�]� �  猆��P�c��;=��D��_>��xYf�ۺy�던�-C� �"}�=��=s/�3>� �Ԥ�SVf�~H �I�ٰ�EO�f�Q�e
�����$�Bՠ������1-O:�����F���\#�j����B�T�*un�� �^T�B\�����}�՜֡A!���s��n��h�� �R
�{7P 4��c�K���͂����V��8=>�M.|]����������>A��ȁ��3���G�d�������F��g$�*�MU �9�Fx@���	�:�:U�Ǥ�GA�G�
������i96~���*<�_��TU��)�ۂk�YgF���{�U4B�#J���q2%[A*�S��ƫ�m��O���8Z�4hc�BE 3D����󍺕+@E����&�7��DhR���m��y݃�P��n�w8���i���G����vƁ�x;��R��e5l-�M,C��s�Q��,��g�;<��>�K߅H���K��Ԡ�
�-~��ǭ	xT �D�����4�h�ؠe<��A���Y���f��U(�B�i�ච���qx�cy|�K"s��ah�N,�Y�u��T��)��taYm` �S��`�?��/3�h(@��(���ne��Sybo�&�u��W���2�ɩ.��4�v0�t�X{Bn9�G+�h�9�[C"|�%|_4���l���@8�c��q�P�~�{�6�cE��o�v{�o���ā�@rD����ǭ�������w��\D$���u��Ԝй{��,������ެHc���g�|�F�j�w����׉��e��Jm���;no���h4����n���u �Ο���/��?�����Nk�����o��,�͓&@�tJrf8�����\+u����}9�=?CH<���>��/>~:����_����K1��4� ��܊ӛϋ�>�����y�tI�T��<͗P���dT��S��m�B��n����*�6e�fO���Tu��=�Ky������ݘ3}�+ �~�Q~L��������\n����#��f hX�:���|{�e��8�(���Dbpq���w�<�S��)�����#���1K�����1��w����ު����D��$�����uT�i�``+�[�륩�GI�����F{��Nмq��YS��E/FCeٸ�|�b�D9��0�.g5!W��K�a9�R��$i�\ ���������r�P��I�"m�8aC8��g� So���/"/7�ٺZ֮jx����Ň���ٱ).�w7����Y�vyd
����>פ)��@3���Ml.;$xc]xM�6�p���e��IzY�����`H���	S��45E\c�h���8���4�N�,$�O���desFQs�����tֿ�B�W>.��(%aJJ9�D��<��5M����p���j�^��5��F�}�.�\�F}�2�56:YlH��2��;��H�h@�@s��l[4�w�_K������&pƸ������fm�����GQ�hW�{�Eubw�m���9g�nL%c��t�A,����]������P2IF�'�IN@�@`,��0��MN��ߥMM͐�H�J��Eo���5>X��{�FgC��朁{�>�O��� v�i����UT��<]�ף��mf3�����o0��]nG�������p��H:��/�����pΏ].bʐ���8;��|j��H���q�q}�ϋו�����R�IuV�B��OL��yp��I�uz��Ѥ�a�����ϹV��;C{�.�xa�&��޺�d�Z��3��_����N\M��n/��*{����L�@�E<w�MW]�>��N����e�ǽS3�������<����z/���x�������H�>P/�����z�k}���Ĥ��'����^�����QVwL���-fT�c��C,�� �|�'������F�������Aþ;���^?&�<�o��K��?��۠�g      �   �  x�m��n�@@�����c��t�)x��,θ�ȑ/�i1�1��C���DQfJ��J%�ޫ�@�&�����
�{�$hc�>�b����?�#e�����DT��m<�D߬����xY��m�Y�,A�v�����ԣ̣b$(�GN�p!;b�SD�;P���J�-�(�{s�hT�~E�N�;�}�c�ǽ`x�~���`��~��T�����
����0� 2)be��M��BY~��*S�v	Cx�}�h`]�
�8�=�l
�"&�+y��bHq��'L���TZ�T��_�|W��;�po�μ�	�}��|�f�|���p��o���Sͯ���5�	�X�{7	9q'_�`ԼŅȥ���5ݭI@縜��E�[�k����|��V�����4      �   j  x����n�@���S�p�2�w*ZP�xøn:e uh���^�b�&]��;�K�/��dP�n���㤑E��=�.��������`az�tdXNw0Ŏ����:�yI�q��F$�r5 �'�P���G��Pk#LX/��kn� d8���βA9CW���Dq�UM��-u�j�oO�7}9ZKc<BM��8)�8��$+�Z���VN�s3pC��x{�Q��6�+a��1�i;��^��O�ݦ�
�@Z!��GaU+�����N�0!�f=��D��.	͖��œ��s�	�ڞs�jtQ�\hm���B�*�U'~I�
�C���;�9��.�)���c �5�*vw���ٰ�|���j     