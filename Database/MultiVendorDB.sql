PGDMP         ,                {         	   eCommerce    15.2    15.2 |    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
       public          postgres    false    227    226            �           2604    57975    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228            �           2604    66104 
   vendors id    DEFAULT     h   ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);
 9   ALTER TABLE public.vendors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    232    233            �          0    66079    brands 
   TABLE DATA           O   COPY public.brands (id, brand, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    231   O�       �          0    57905    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   
�       �          0    57912 
   categories 
   TABLE DATA           R   COPY public.categories (id, name, created_at, modified_at, vendor_id) FROM stdin;
    public          postgres    false    216   J�       �          0    57920    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   n�       �          0    66112    newvendorsapproval 
   TABLE DATA           ;   COPY public.newvendorsapproval (id, vendor_id) FROM stdin;
    public          postgres    false    235   ��       �          0    57928    order_details 
   TABLE DATA           `   COPY public.order_details (id, user_id, total, payment_id, created_at, modified_at) FROM stdin;
    public          postgres    false    220   �       �          0    57934    order_items 
   TABLE DATA           X   COPY public.order_items (id, order_id, product_id, created_at, modified_at) FROM stdin;
    public          postgres    false    222   :�       �          0    57940    payment_details 
   TABLE DATA           `   COPY public.payment_details (id, order_id, amount, status, created_at, modified_at) FROM stdin;
    public          postgres    false    224   W�       �          0    57948    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category, brand_id, vendor_id) FROM stdin;
    public          postgres    false    226   t�       �          0    57959    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, address, created_at, modified_at, logged_in_tokens, isemailverified) FROM stdin;
    public          postgres    false    228   Q�       �          0    66101    vendors 
   TABLE DATA           �   COPY public.vendors (id, password, business_name, business_address, phone, is_approved, is_admin, disapproved_reason, email, isemailverified, is_super_admin, logged_in_tokens, is_under_approval) FROM stdin;
    public          postgres    false    233   �       �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 166, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 115, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Order_Details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Order_Details_id_seq"', 1, false);
          public          postgres    false    221            �           0    0    Order_items_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Order_items_id_seq"', 1, false);
          public          postgres    false    223            �           0    0    Payment_Details_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Payment_Details_id_seq"', 1, false);
          public          postgres    false    225            �           0    0    Products_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Products_id_seq"', 61, true);
          public          postgres    false    227            �           0    0    brands_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.brands_id_seq', 29, true);
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
       public            postgres    false    220            �           1259    58001    fki_product_id    INDEX     E   CREATE INDEX fki_product_id ON public.cart USING btree (product_id);
 "   DROP INDEX public.fki_product_id;
       public            postgres    false    214            �           1259    58002    fki_user_id    INDEX     ?   CREATE INDEX fki_user_id ON public.cart USING btree (user_id);
    DROP INDEX public.fki_user_id;
       public            postgres    false    214            �           1259    66123    fki_vendorID    INDEX     R   CREATE INDEX "fki_vendorID" ON public.newvendorsapproval USING btree (vendor_id);
 "   DROP INDEX public."fki_vendorID";
       public            postgres    false    235            �           2620    58003 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    238    216            �           2620    58004 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    226    226    237            �           2620    58005    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    214    236            �           2620    58006    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    216    236            �           2620    58007    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    236    218            �           2620    58008     order_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at ON public.order_details;
       public          postgres    false    236    220            �           2620    58009    order_items update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 7   DROP TRIGGER update_modified_at ON public.order_items;
       public          postgres    false    222    236            �           2620    58010 "   payment_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payment_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 ;   DROP TRIGGER update_modified_at ON public.payment_details;
       public          postgres    false    236    224            �           2620    58011    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    236    226                        2620    58012    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    236    228                       2620    66089     brands update_modified_at_column    TRIGGER     �   CREATE TRIGGER update_modified_at_column BEFORE UPDATE ON public.brands FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at_column ON public.brands;
       public          postgres    false    236    231            �           2606    66090    products brand_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT brand_id FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 ;   ALTER TABLE ONLY public.products DROP CONSTRAINT brand_id;
       public          postgres    false    3293    226    231            �           2606    58013    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    216    226    3268            �           2606    58018    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    218    226    3273            �           2606    58023    order_items order_id    FK CONSTRAINT     |   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 >   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_id;
       public          postgres    false    222    3276    220            �           2606    58028    payment_details order_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 B   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT order_id;
       public          postgres    false    3276    224    220            �           2606    58033    order_details payment_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT payment_id FOREIGN KEY (payment_id) REFERENCES public.payment_details(id);
 B   ALTER TABLE ONLY public.order_details DROP CONSTRAINT payment_id;
       public          postgres    false    3281    224    220            �           2606    58038    order_items product_id    FK CONSTRAINT     {   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id);
 @   ALTER TABLE ONLY public.order_items DROP CONSTRAINT product_id;
       public          postgres    false    226    222    3287            �           2606    58043    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    214    226    3287            �           2606    58053    order_details user_id    FK CONSTRAINT     t   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 ?   ALTER TABLE ONLY public.order_details DROP CONSTRAINT user_id;
       public          postgres    false    228    220    3291            �           2606    66139    cart user_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    228    214    3291            �           2606    66118    newvendorsapproval vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.newvendorsapproval
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 G   ALTER TABLE ONLY public.newvendorsapproval DROP CONSTRAINT "vendorID";
       public          postgres    false    235    233    3299            �           2606    66124    products vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID;
 =   ALTER TABLE ONLY public.products DROP CONSTRAINT "vendorID";
       public          postgres    false    3299    226    233            �           2606    74270    categories vendorID    FK CONSTRAINT     �   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ?   ALTER TABLE ONLY public.categories DROP CONSTRAINT "vendorID";
       public          postgres    false    216    3299    233            �           2606    74276    brands vendorID    FK CONSTRAINT     ~   ALTER TABLE ONLY public.brands
    ADD CONSTRAINT "vendorID" FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) NOT VALID;
 ;   ALTER TABLE ONLY public.brands DROP CONSTRAINT "vendorID";
       public          postgres    false    233    231    3299            �   �   x����
�@��ܫ��.ɵY+upu�ҡ�Zh����:�B����Ϗp���X�}]G�XS �J�H�R�$�mv�a�%8�j�=����՞ݾ�������A�O�lYF[�Z)G_I
�������2�}�,��h���$�B��~%{*x����wν2i\�      �   0  x�}��u�0D�dn�x�Z��C$YO�~bdSk�Єe����/�X��lC�A�04�6�3�LC��l�R!��3Ax���d�>�A���@6�f�'�	�)�$��)aEp�d>����ź�*+���C�����`�\�� ����MO�O�T� �Rl��ㅹ$��DE�����Y	��ݘ����:^]��H��̯�{I�b_7V�A�&YW �����K�L���~��A
���7�\�R�>����[@��#�:�]7��\FÜ��@R��@oN�J����/3!��      �     x���MN�0���)r�X��'޵HHl`���V��T�����Ho���{o�μ��~8�|�X#F��آT�\��H�QDo�;5*2���-?2i�k�,#�� 
�y:��i:\ �ge��lK��+@8�����/�&�@QȲ ��>E��vS:n1�ɪx_t��f۽/WYʢ��Z+��@������L��/��|�g���"��ΥR6�u���%� �p���o��y4O��n)E�zJ Bk��0_uR�.I�
$��^W�W[U�8��m      �   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      �      x�3�42�2�42������ ��      �      x������ � �      �      x������ � �      �      x������ � �      �      x��[�v�ƒ^3Oѹ�\y����_<>��eY�$Ң�99�4ID  �I��b`v�:�4��
�UuIž^�²��������c5�L���W[�d쇑�-1�U�U�~��m�'T��L^v/R��*��u�KI/x�]��,	�\�Y�K?�X�^*�DxIp�Ea��>�TJ<faN��)&I��V$K1��U���x��K��p�Fǲ��tZ��r:�vF���3h�V���^�p�3�{m۲z�A�e7�F�F����{����u����o��O���O�0���1��1��?�UCk�a7��~c�DIf4�D�U�z,�2'��?�Z*j��*o��\����4�#i�)���/������W/Sޭ��vka��59�	߸[���=�:-�3�h�q��~��gw�酸�)��^^�M"N��^<��Z��п�r�?�I��]�n�Tb����K�z�U��"���Ead�o#)��E���8�,��V�i���l��DI(	=H���+~]�c�i�<U.�5֞���V���m��Ϳ�9J0�Pk)s��i?k�2�G6��N�<� �Ώƭ����%�bw�dby_��H�����A�S6{��E��j+��xQ�5�0U�XF�J����$�R�,N9K����C+��'��h������DO<,_K=	�e'�T/�@�!�ZH̼x�N�/H6�vR��y2h�� \��!������M�Z�-y*���,�`��xW���?�g����{|P:N��tV�J��Ao�-���NW����T�G�dؘD���a���{��2�[�4*�8���fF�Jv_X�Bs�HP�94���B��r`�ϻ�I�"	���"SPP��F83�#�õH�*/�O�Vksf�z��%K�,T���ʧ� �S��$���\�<e	��w�6�GNL����<G�� ���L/��f'<�<��s�PA8��R�7_{,�'�'�U'�Я�|�8!�I��Rh^�}g��!*�^{YʓDr.v�Ԧ�o�`���PĨu���Z�d�����S��MB�5�4i�P4���[Qď^���cR���K�&��-4��ȻÆ�u�ܶG������}�����u�O�ߪ�%�t(He*BP��<@�1�rq^F�;�$G�b�(���e�sπ?�f���d��qx�_���?���0g�`�=�Ȑ:�`�S�&�I�3/Ժ�	�~�y���
� I�zmV�1e72z��t��-:�
� ��j5�w�լ�J�*h��G�+ݹ��s�*͙/�����c��gC�8@e#20p�%M��+����a Yjj2�lg�d7�8�b�D
��#˅R"l��"H
��Me+�B�5�d�EV�ug���h"�Ҍ8�I�m>�2�\�>��9����#��S���Q�U�O��x ��_���Ѓƒ/�z�+���|;�1Lcʒ��E�<�.�� �^�\��\����2�y� 3�S[� �D3�߬t]z|�~���i�i��.�9���!�L�﹈����Yf�L����?�j�ҊP���.f�31��*Uܮ!<��GɁ5�;:J�c��N���+���ʄ��q%���� &t���rh����L2f:F�U���9j*G����!DT��X�����,.�>�㖚��$B�*4 �l$�h.����D�%$�h��NP�����r�̛����[R��>�A�8$6���m��_	��Q�3�b������������5��ا��,M@�{:S�mR"^$yS\��'�~�b�S��!9ծF��Ř�$�kp�=��cfv�zpx�Oj����>�߅���4��j�2�x�dt x88	�e��{�K1�3m8��)�T����N�� 
�bL�,��,�#����ij�}E�@��:�Kimq�<(K�h>�ptK��cpc}4B��Y��"����9N�N%*�m�
��/6��G��5�"�;N�����v������r��.�������w����)��C+�A;v�rz�?h�Ț/�S�SkY�\= �A_�[���-�t�ĩwIv�6��Y(���	����N#
7s�S�1������]����o�u>�/L��	��8�3��k_TՑ1<�!��R�Q������M�JR(xaD�ހf���?&���c�6LO�xLb����wʬJ'�=�\ÌQ�^j�2��<i�[®���Į�bH�`�6���OQ^�mu����l9볽X��ʣ8*�ҷ2�{�����,� �q���k����~��S�"_�����.5�����.w�W@�ø�4���2�X�˶&����YD "��9��{&���IEETJV� �3�Y�2A���/+��V�	1�����x{,��[�ڜ[A�,��N	$���ġi��a��M"��%���l�4{G�rH� ��j2В��U�hx��/�	t�q�3�2b�z\�,�#�9��o��۲��Q%u�KYp��j��M��PਢAK��!���Et�p��8�mS����U��%����W+����>�M���i;����	#{�I�(�t-g�[]�j�z�g��.�L���+�H��2+"�'���	ĥ���֖�g���):����m<O��pr��N��l���g��:d?P�[�-L$�˩���r����(8���@Q��J������|�9��m�Z�Xd�5$KJ��@�umG���S)���#Y����ȿ� ��M��q���C�,�d#vJ%7�w�pb��~�^!�i�����
��^�]J�7r0��(�8S!ZF�`�X��˚@v�Q���;l��~��W­#g�z�����?>../����y�TU6�(��~C%�� 6OEG܆�+
⇊��CTJ�y�;#4bEJS�r�<��Y߿��2͎q��\Z|$ܾ3��+����!���%~�2e�b�/�b��<+�@����<�b��m���9>�'Ȥ\�鳩"���I�#r�C�j���U��Zz��
�;���� A��T�	p�CfS��n�Pqj
������4�T!�}LF�&#�"��'��� e�G���e��i$k��<I�bs�f�#/[ɖ�!� L(mV�p���0 ��4��٬J����a��C1�KP_˾l��'aSe���"���������E���7#-@e�eηt��~��ɖ���~�\�rm��2�K�����\PT.BVd�	'�a)�朋5PJsI��B�6Z�3dGi&����}4M��"E^��p'M�6a�%���-+;�j�U���2�H:����b��>�,�)�!7���0�l� p�M�g�KW
��Z֍,f~��-�L]� /�y���)yR�j꫎Xu��P�]E����H_:5�N����njǇ{���a��=tc�vQ�^��Li��� �� ��
�X���N�kO���Dm����]�@�>���R�gԵ�Î��|sy�3X�`h#,=u��������s\��(�mL�^�:��r��mYD�>1�7�|�;�}�{�`E�O3b�林"�[
�|��uzjݻ����UX*)�bJ�+��Pm�r��e�m�'� ǔ�>�@Z�gFUCV�}��*$*B�
H^N�O\��	����c1�ǒ��,]��S���[ժ�|	����:~$=�ۂ!�$A�qq�ܬ�azH��� �ZFi�xս��,B+�20ڐϩ������{�IR[!N�V�<���
��i���ܔ�$�|B"��ܰ-8v����:B��;q��ҳ�#.�u�6������Y���Z���
φw�ۃ�QE�t
�EF!���(쳲��V���4RV�I1t�	#'5*"�0�NϨ֤�DٺS�,��aV� ��v/ůb��t���;(�<gW��i��"f2͢"7�t*�A��_S�$�adf��Xn\�r�g����Rh����ݥ�|�W�������.��r�|΁o^�)U,K��t�<��`i�m�C����)_�K�þk� �8��>NB���L]�å�n��{�oD�<�8'�1b���Me �  �9HxlQ�.�sT��lFPTlĊf*�)����<�0GNP���àũ_��.c/a�0�����E��̥��k1�	�-׏���k�����]:oC���V�}��7�{H�{�zv������n?Ȑ�{��5<!VT�+OG��V��y��3��C���@T���D�r��?(sQD��@�aF�RSL�,X$tE�o�E,l�F�D_���9�P���EUZ��-��6a�m���S���*d��]�<�R��o��x�r�kL3BȂ^�P*�4)#�%����?r�m����~P��[�]G��o�����:���	Һ��?��b�6F�"��G���
��D�Z����1�&�|���]0��̪Б�젏�! (ͷ��Z�׉���tIJ�ذ��T	���鵭����3����X��ज?z�_Ɠ��t�J�4f��-]Ƥ��2�,)p���N陎y"t�IʤL�}���}�m]�o��@`ή/��Ň���ě��������orq)f��w���F�N?�G��/��&��o�$M�(`�<�)J(�!� �ŝ���c�"T�][A�����,# �)ԯ�Oʗd�PHUه������.�Ɯo�����q�1=Z�<fgp�DOG��r����	I�w�BG7l�
�S,��gTV��G͉��R$����g[��$I���u>�`����E�ħ�����En��_LY}�c/�Kv��S������~��kz��s5����=0ab�礩?GI��Zq�i�^A����I�e�" ���]��U���5�Y�&������9W^,��!���
H�`���T�g��S�{�xp�B��sj��M}m����k��L���"����<��9{��$얽�ߍO/ώ���v|{1��|<8�e:l��Ԅ_�q[}��1
t>���Ml�n�����X �q.�Z���2�~�^��$�[ѯY-KPQ��0%$��@�5VρGk��C�^\	I�R��`H.�D!���Մ���]&s�O�4�0{�̋b��(SR���%�̏�����
�`U���V/�k��P!��7��510�S��ü��f�W�lǸ���.���)�CMQ�"0�ԺT�o�?�r\h�@�����yH��T��ð�(���*;��I���j35Q�K���1��iS�y�g�����g��W����Ԗ�0z���h�@�A�º��wiR��QiQK=���������t��7�D�;O�*r�VmE�W��0�&��4{��:�$K���6�4��2���BH�F��~�����xUd�V�I�a,���!f��`d�D;o�I�!���]Yv�Je�G���hicc�]�;�H�����3�l5��!��G�^����=~ڣs��|ε:���ٛ���u~Xj8�V&�������eH��ݴG�d�OM=	�~�8���6L���>IH���B��/��(�(=��!�%6��V^rF���ׯĉY�}�X�@zm~	�~�,��#|C�������.�P.�r�Ȭ��K� ��bN/��qI��k��ŏ�C-��*0�,�9�Q�~��;>������T�,����tQ��A�؛���p7��t#���e�D[���H���=+�4Z�ͺy�|cDn]�>D#�=���﯑?�+ܑ㶻�a���׃�'O��v-*Wd�?���#Q^jJ���@�*�քM	�FI4��'E��z�W�dL�4�]�43�F0Voy���2* 7��d���IU�2�{���F.�	�mh-�o��!�Т`"�J���G�gυf�=ۅҾ��X�C���������7b.�kИܜ�,�r&�7��j|{vs1��S x���Dp�(�G�|�k��܊�Awض,���Լv�U7y�Qe���L_�-^����5���G	������n[_��Sb�K�O.��޽�=�鯆�����ڶ�PA��*�3�v{H��{f쌬>��\o`��o6c��z�a˱W��{��kø�{����?�޵c      �   �  x�m��n�@@�����c��t�)x��,θ�ȑ/�i1�1��C���DQfJ��J%�ޫ�@�&�����
�{�$hc�>�b����?�#e�����DT��m<�D߬����xY��m�Y�,A�v�����ԣ̣b$(�GN�p!;b�SD�;P���J�-�(�{s�hT�~E�N�;�}�c�ǽ`x�~���`��~��T�����
����0� 2)be��M��BY~��*S�v	Cx�}�h`]�
�8�=�l
�"&�+y��bHq��'L���TZ�T��_�|W��;�po�μ�	�}��|�f�|���p��o���Sͯ���5�	�X�{7	9q'_�`ԼŅȥ���5ݭI@縜��E�[�k����|��V�����4      �   t  x����n�@���S�p�28\v*ZD*^����SP��[��Z�ڤ���������4��`�8k�Xߜ2�_˲���:Z��2��,o0��tŕ��C�d`)?NA�ژFe���\ȋ)6�(
1e��$�P>Ȓ���;�9�j��g�g/n��C��	��M}u4[
�H]8�+�ֹ����U#`����Nv�a�� �Jb�Vĩ�1�E���8wI�y�+}��Y����b�HA�7�j[`��"d��l�����=�_tg���d��"8LHZ���A���j-R��u��!7������I}{�2i���G|NHCے��𚆿��?m*�dJ�>�������a���g;�\�E�]kl?�?�)��{�9�� �S     