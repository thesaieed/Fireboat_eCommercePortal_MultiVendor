PGDMP     4                    {         	   eCommerce    15.2    15.2 [    w           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            x           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            y           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            z           1262    57901 	   eCommerce    DATABASE     ~   CREATE DATABASE "eCommerce" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
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
       public          postgres    false    214            {           0    0    Cart_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public."Cart_id_seq" OWNED BY public.cart.id;
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
       public          postgres    false    216            |           0    0    Categories_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."Categories_id_seq" OWNED BY public.categories.id;
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
       public          postgres    false    218            }           0    0    Discount_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Discount_id_seq" OWNED BY public.discount.id;
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
       public          postgres    false    220            ~           0    0    Order_Details_id_seq    SEQUENCE OWNED BY     O   ALTER SEQUENCE public."Order_Details_id_seq" OWNED BY public.order_details.id;
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
       public          postgres    false    222                       0    0    Order_items_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Order_items_id_seq" OWNED BY public.order_items.id;
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
    category character varying
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
          public          postgres    false    227            �            1259    57959    users    TABLE     �  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    email character varying NOT NULL,
    password text,
    phone numeric,
    isadmin boolean DEFAULT false NOT NULL,
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
          public          postgres    false    229            �           2604    57968    cart id    DEFAULT     d   ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public."Cart_id_seq"'::regclass);
 6   ALTER TABLE public.cart ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    57969    categories id    DEFAULT     p   ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public."Categories_id_seq"'::regclass);
 <   ALTER TABLE public.categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    57970    discount id    DEFAULT     l   ALTER TABLE ONLY public.discount ALTER COLUMN id SET DEFAULT nextval('public."Discount_id_seq"'::regclass);
 :   ALTER TABLE public.discount ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    57971    order_details id    DEFAULT     v   ALTER TABLE ONLY public.order_details ALTER COLUMN id SET DEFAULT nextval('public."Order_Details_id_seq"'::regclass);
 ?   ALTER TABLE public.order_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    57972    order_items id    DEFAULT     r   ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public."Order_items_id_seq"'::regclass);
 =   ALTER TABLE public.order_items ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    57973    payment_details id    DEFAULT     z   ALTER TABLE ONLY public.payment_details ALTER COLUMN id SET DEFAULT nextval('public."Payment_Details_id_seq"'::regclass);
 A   ALTER TABLE public.payment_details ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    57974    products id    DEFAULT     l   ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public."Products_id_seq"'::regclass);
 :   ALTER TABLE public.products ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    57975    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    228            e          0    57905    cart 
   TABLE DATA           Z   COPY public.cart (id, user_id, product_id, quantity, created_at, modified_at) FROM stdin;
    public          postgres    false    214   o       g          0    57912 
   categories 
   TABLE DATA           G   COPY public.categories (id, name, created_at, modified_at) FROM stdin;
    public          postgres    false    216   �o       i          0    57920    discount 
   TABLE DATA           _   COPY public.discount (id, name, "desc", discount_percent, created_at, modified_at) FROM stdin;
    public          postgres    false    218   �p       k          0    57928    order_details 
   TABLE DATA           `   COPY public.order_details (id, user_id, total, payment_id, created_at, modified_at) FROM stdin;
    public          postgres    false    220   q       m          0    57934    order_items 
   TABLE DATA           X   COPY public.order_items (id, order_id, product_id, created_at, modified_at) FROM stdin;
    public          postgres    false    222   �q       o          0    57940    payment_details 
   TABLE DATA           `   COPY public.payment_details (id, order_id, amount, status, created_at, modified_at) FROM stdin;
    public          postgres    false    224   �q       q          0    57948    products 
   TABLE DATA           �   COPY public.products (id, name, description, price, stock_available, created_at, modified_at, discount_id, category_id, image, category) FROM stdin;
    public          postgres    false    226   �q       s          0    57959    users 
   TABLE DATA           �   COPY public.users (id, name, email, password, phone, isadmin, address, created_at, modified_at, logged_in_tokens, isemailverified) FROM stdin;
    public          postgres    false    228   D�       �           0    0    Cart_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Cart_id_seq"', 118, true);
          public          postgres    false    215            �           0    0    Categories_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Categories_id_seq"', 108, true);
          public          postgres    false    217            �           0    0    Discount_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Discount_id_seq"', 1, false);
          public          postgres    false    219            �           0    0    Order_Details_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."Order_Details_id_seq"', 1, false);
          public          postgres    false    221            �           0    0    Order_items_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Order_items_id_seq"', 1, false);
          public          postgres    false    223            �           0    0    Payment_Details_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public."Payment_Details_id_seq"', 1, false);
          public          postgres    false    225            �           0    0    Products_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."Products_id_seq"', 54, true);
          public          postgres    false    227            �           0    0    users_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.users_id_seq', 108, true);
          public          postgres    false    229            �           2606    57977    cart cart_pkey 
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
       public            postgres    false    218            �           2606    57983     order_details order_details_pkey 
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
       public            postgres    false    226            �           2606    57991    categories unique_category 
   CONSTRAINT     U   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT unique_category UNIQUE (name);
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT unique_category;
       public            postgres    false    216            �           2606    57993    users unique_email 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);
 <   ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
       public            postgres    false    228            �           2606    57995    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    228            �           1259    57996    fki_category_id    INDEX     B   CREATE INDEX fki_category_id ON public.products USING btree (id);
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
       public            postgres    false    214            �           2620    58003 ,   categories trg_update_product_category_after    TRIGGER     �   CREATE TRIGGER trg_update_product_category_after AFTER DELETE OR UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_product_category_after();
 E   DROP TRIGGER trg_update_product_category_after ON public.categories;
       public          postgres    false    232    216            �           2620    58004 +   products trg_update_product_category_before    TRIGGER     �   CREATE TRIGGER trg_update_product_category_before BEFORE INSERT OR UPDATE OF category_id ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_product_category();
 D   DROP TRIGGER trg_update_product_category_before ON public.products;
       public          postgres    false    226    226    231            �           2620    58005    cart update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.cart FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 0   DROP TRIGGER update_modified_at ON public.cart;
       public          postgres    false    230    214            �           2620    58006    categories update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 6   DROP TRIGGER update_modified_at ON public.categories;
       public          postgres    false    230    216            �           2620    58007    discount update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.discount FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.discount;
       public          postgres    false    230    218            �           2620    58008     order_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 9   DROP TRIGGER update_modified_at ON public.order_details;
       public          postgres    false    220    230            �           2620    58009    order_items update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.order_items FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 7   DROP TRIGGER update_modified_at ON public.order_items;
       public          postgres    false    222    230            �           2620    58010 "   payment_details update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.payment_details FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 ;   DROP TRIGGER update_modified_at ON public.payment_details;
       public          postgres    false    224    230            �           2620    58011    products update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 4   DROP TRIGGER update_modified_at ON public.products;
       public          postgres    false    230    226            �           2620    58012    users update_modified_at    TRIGGER     �   CREATE TRIGGER update_modified_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.main_update_modified_at_column();
 1   DROP TRIGGER update_modified_at ON public.users;
       public          postgres    false    230    228            �           2606    58013    products category_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.products
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT category_id;
       public          postgres    false    226    3246    216            �           2606    58018    products discount_id    FK CONSTRAINT     z   ALTER TABLE ONLY public.products
    ADD CONSTRAINT discount_id FOREIGN KEY (discount_id) REFERENCES public.discount(id);
 >   ALTER TABLE ONLY public.products DROP CONSTRAINT discount_id;
       public          postgres    false    3250    218    226            �           2606    58023    order_items order_id    FK CONSTRAINT     |   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 >   ALTER TABLE ONLY public.order_items DROP CONSTRAINT order_id;
       public          postgres    false    220    222    3253            �           2606    58028    payment_details order_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.payment_details
    ADD CONSTRAINT order_id FOREIGN KEY (order_id) REFERENCES public.order_details(id);
 B   ALTER TABLE ONLY public.payment_details DROP CONSTRAINT order_id;
       public          postgres    false    3253    220    224            �           2606    58033    order_details payment_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT payment_id FOREIGN KEY (payment_id) REFERENCES public.payment_details(id);
 B   ALTER TABLE ONLY public.order_details DROP CONSTRAINT payment_id;
       public          postgres    false    3258    224    220            �           2606    58038    order_items product_id    FK CONSTRAINT     {   ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id);
 @   ALTER TABLE ONLY public.order_items DROP CONSTRAINT product_id;
       public          postgres    false    3263    226    222            �           2606    58043    cart product_id    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
 9   ALTER TABLE ONLY public.cart DROP CONSTRAINT product_id;
       public          postgres    false    3263    226    214            �           2606    58048    cart user_id    FK CONSTRAINT     k   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 6   ALTER TABLE ONLY public.cart DROP CONSTRAINT user_id;
       public          postgres    false    228    214    3267            �           2606    58053    order_details user_id    FK CONSTRAINT     t   ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id);
 ?   ALTER TABLE ONLY public.order_details DROP CONSTRAINT user_id;
       public          postgres    false    228    220    3267            e   �   x�}�A�0��+� XX��-��;J�C5��mvlSo�����:v�f��������f����͎_1$y�qAs���LD	��{�'�e)���	R������ݤ��Ip>����?ry
O���qw@�D����r]�2̒�/齿��GJ      g   -  x���MN1���)z�Z���;ʊ� l�����4Sq~�j�JRv��������6���Ȳļ$Z9�'�JfwF��cw�즟]�,H<����,3y�D��mb������4�����_�aNW�	�ե �0S4�ñ_��/�8%�\��[�P1��$��n��d'u�ͪV��\� 5W�(-��n<^��L��� �$:ӛ7s�Щ�R��:�_�u��h큥J-Bɭ�q���m�݀�9_��xnQ]�`Q�B�鰿�O�
��_��\K�����HhaսM�;�T�$��;��
1�/~���      i   x   x�]̱
�0���
/mt�lǚ3�~@��B��������[�xp���\�������~�o�����yq����!�jy��t�2�f����*����ev�L�e��2.�4SĢZu�%�Uw&�      k      x������ � �      m      x������ � �      o      x������ � �      q      x��[�r�H�}����f�]�@���:��e[Ӻ�M�՞�Y(�h�(It��~��������/�ɬ�왗��%�KV^Of��A���B\�B�����[%N���Q��"
�w�:gq��*e���e"V*�U%���2~�:�D�y�o?|�{~����e^D��o.
��a�g;��X�P��Bek?��ʬ�%"(�C���U.C�c�P+1�{�W��g�x������8��i������ix��Q/�g��(l��ױ��"�HY�zÀ�����2�7�V}^UO�����r'�X=�0e�lW<�&����4J�ۯx�T��L
Ϣse��U�n�8ƞY���X��:'���E*��U�j�~�̹�����>[��<8�����EO<��H����H�4A�-%&f~�� �
�6��t�U��<^l&}�ΐ�DI~=H~��֛4�G������"�WI�W}��ؓIǱ���,����L]{jM��x<y�Ր_���3u����Q�gw�2����f������	~�<;{w���[�]�O�h��t.�'���r��
6�%��bd�u��i�Ф?�F��X�8�x�ƹ{b`Y��:}�|s�}z�2%�t�dm��h8��������W��T�m�B�ѓC��XM���kE�Q�P���ulw�r�L�a��Gް�K��X�=�W��![�C�xNoh��7w���.�_\ڶe���[��3�}<��^�r.fo��������r!�|��x������TEI�~�J~,�gr'N��oY���A���Ĵ9/O�u�w�܋���ό��	���#51GC�e!~.���t~+Z���u<�m�%AB��T�cO.��>����ɅX�	~�}[�I,����m�r�q0�F���?��[�F����S۞�n�LF��Y��0��������޷��q�^���ů7�,�ڎYiWe,\��B{P:�>:]�[����ʋ*0��ˤ�	'�o��Ӣ`O��RK�f���y�Q*f�Q[)�\���ga��v$�B�B%�(/�K���Xs�י��:FNpY�1�1'��EA�W���?Da	����v5�w���A!�|3����,�u��_�F��ap b�������?��o@s�ކ�%���� I�<!m)AiFN<��"�5�����@N"�~�A7�2�Y�j퐨�W��(`f�Pe��5����&�)��K�Q���[��<�|���֟�2) @�M���e&�a�����G� ���3wt���t0�w2p��,��'���Ut>���i'�9)�E�IdD�a�煌�_�R|@��h��W~�튳M���m�v�m�})�w�|WW� �~^r�K�ҴKzs ���N��LF/)|�f�kyo���Ў2���:�Pq��-hm�iq��C�}�Cb�;KTG]�.b�T����bE�Ѽ���>�G�)����* l��"���(濜����EA��bUm�i ҇+'��{�5���n_��gf^���LmE���)�L�U�PB51N���|��hH�]\�~��j���Z�H����������������j=:r�C��\k�������c��@�N����^睿�Y�w8���O� X`�Cp�8���
B�J{���h��F����K��U\o�l�$��U�2&�Ŧ�rE���CKi�C\��&+CTd�����o�:��큇�t�lب�l�����ƶ3	����/��x3�p|��Dq.j�����ٖA�4yH�&��9�14����o>v�e᯺b�I�s0v�~����:������2�C�é5�ZV<O&.���t���,�ڜ��&|d|~ḝk�!A(�U��X��K+�����m͉�Nᇈ�&�����̜�^�kZi[!�.!T0F�d������L�Q�c�fT�Q�g��EY�n"�S�\�Q,���^l�a�c1�E������K�}⌼��X��q�Zބq�hr�@�0�	�f~��7��>P�Y@�Ie�/�agv����+�J��5�X�Q��B���ʼB ���C1.�7Y��i�(ť��*�����ީKX7\���g�a���p���`-L�9Վs�X�F�kd���mV�6�wp�8_V1A�_�2o�3`��s*���hT�- i�MF���<��N���X�U����FSY���Ƈr u�0v��o�m��ɤ7��M<^���G������}%�xK����� N٨/�"���Hb��ɘN�=mYGg G�	�2�Ĕ��<H���;����}�R�*&P�;�d| 	�5��G��^$�ܾaR� �����* pJV3��8�&+Čz���>iҭ�c��P@i��"b\K苍�ƽwz����Ҭ`�L,8�_�iGr�����0J��o��[{��� Ԑ��=�}^�d��(�β�a��Y��z�`��ۛ����6G&�?�Zʿ���7�1D��c ~�̄)��K�� �0p�\�����p�R�ܽB��Y�}�e� ���c;�m<B��J�	�:�3|.~�Z�x<��}9��~*'j��g�82�Qَ���	 ���ID�a�H�I@�t������I��y�
e~�y�$�
�4�4:��bF�;H �֞o��e��v�T;��Q�/u0��
<e�l�+A���I&��j��3p*QC�9p7�7	���r!��d�K0
�3��-Ö�;d� 7(�`
W���J�~T��#���Z%j�]��|]���lV����!s��4e�fN��T�n���y��B�e�fޗHR ��N�XDN`D��͖�}�\��δ���D�<�s��r���Y�Nt��]�]v�tl�;@E6��O�v���ڳ(v[�7�<W�(�ϱz0���	 f9�9󖚈��]P�F۵NLA�����]?�š$��xZ�B�f<�'$�$��_�KN�*ẅif� ���~����E���2�ލ�T�hJ+�	�7ڋ�\�b�\�)�� ���zl����H�y�ܬ�s������b�9�j�T��Q�yKU1�;%�֔U�b���'��3��t��鬒�F\%$ �����y˰zOb���i8�{���B��]<��6%�G��#.�}�t��������"?���%4�k���	�A:�T�x2��꓄�V=*8PU1��ݴA�F�U�k����6U͇2r�E�U�8m�e( ���>�K�rp>�*^W��xZ��iG��U9�Xc	dHC��P%�^d5�"(ML���L��>�[�Ҍș1���>���lq�����(9	�L'���$�̱�Z2̩DXs�ő�4�Ђ-�g_MT��Vې0[X��2�:lh�^�#�5+|�� �[�/V̰�����o�"5��\�`T�&D ��H�w��1ZB�L��܁�A	ڮh�9P5]�ܳ�֔ڏ�K���=z�@ġ�sP�R�%���8���i������ �����񞁏�P�G8�m�Ew�����W��q2-.�Վڀ��ߛ/L�eƚ���ҔJ������2X���z��_DPU��,�~�X�T}��LP�y�_� �#H�8��N�&6�9})#r�K�]�<B���Х@�\`�=H+i�d���Z���J�P���6L
�wG�H�ԁT��>;���0�A��^fܐ��AA���[G�]���%*�\l}|���oi^���a�ow:���Ĳ���Y��5r:c9.[Y#�C�2���͇���se+��G�8�~���B�����-�\�UAL0]r��Bet��L��h9UO��8Y<�U[S%	h�`ʪ��������?I�6m�
F	Ɣ�."(6[k������#v�>�ƫ���&i������2[�r
�8\���{�I;aYH?o�h6�tM�ZC�U��!���|?�҇��d?k�?�s�%&(i\�&��>	�\3ȍ��4�J����.�-2�-��ުLS�`���Z������i@[o{e�{_A������2��!,���B Y  �|2P�ڎte��E�m��X�{�kJ�Hm�Z�F�c�`5�e�	2�sۖ���� -3��ɪ�+.�_�ur�ns�V�"�HK�@:!�
�7t=27����yG�8HO�=�.)�U�ҙ�*�9�_Q�o�4��9WO�Q�)��r�&��t�q?�܌�*Gkq�:����Y�k<P(nXR��W��1�̟��T׳�nỸ��"3 úӮ���R�s��t��3��W�X}o$�"�嬨,��z ���J�ى�1�2������̇G�d>��e$��=�Ʈ��2a����-�T�%�%��PGD�:���#S�@
X��s�����`4$��Z���rG�g4u&}{�M���e�'vod?�O+��Ã�F��<S>�;T�B�וP��]�F@m���-@-Er���ީ��j:���=&C�V�G�D��1uI<n2����ܪ�����}��Y�	���Մ��̓�ˊ�w��UɊ�A��5ŏ�]�^�x�e�����RqÌ���S�.�E�r�+�kQ�����|996�G�$`�1!���U��DкjG�!)z��Ԝ�V}vsq��>���"��(�8�BJ���=�-���h�F��w���U���X�;��\�#�;���4J*IS��h('�tscgjp�xB��5��]vK{J�h�Q��Vu✧|�����e�k��w�Ue����Wd�5eDo���<����a)}�hw�sk_o�DWTWw�8�R�)�k�hw��E�v�U�xK7�8`kơ�Z4Ж��Pg;���l�_t?�E�n�n���gZ#E�[?(��	8E�v�����x�Z̢�26��������4�'N��ϻ2�w:�۰/��l=	_gW}ӓ��V+�����L&mM�A�qo88��XԊ�s�(�q-g�Lz�}5N����H��B�{�9�;	�2���Ǘ#{�SB�؟�?�]H�;��ѩ����km��b��s����Waݤ�I�4�|�Վ6�eoʔ;����*���6[Ă�qLm��62ݧ�y�VT��sGoZ'j���*��?q���_� �K�Won�x�b�|�(�a:5�o��\�@�Fo�����.S�A\���>��or����sE�|�;�-�:���QwD-��d���a�ʚ�^�Q7�����d<�D���Ϗ��o�u:s������*E������)5�L'��Y�(��J]?|�*�����sq3?���~/>]_���\�=_\��xH��..��������8�����G����"����DM]�n�算�L�
�]I�)�_,k�<`v���4��,p���O�I��5ʓ���'r$My5��S�+�i�܄���9����eB��� ��r�ܪ���k~GT�Ւ?�:N�C�,�|{�e-G�_��O��	e�8׫�"��(��[�O�:�F����O�s;R�Ex�%o��j}���RUmfo%rS*�Н��+�#��� �T���!M8���?N�����]]�%�V?���/U�䞵�ߙ0'��7'�M�ٺ��y�rIn���|�
Hp ��K8� j�x*��3��y���`W� 6�#�oq�60����2���
:���Yv���l�avzy~l�������������RECݻ�w��A��Fԝ8����.��
���.�:B{�@|�:}�~֫/Fv�!	*8�-J��R����9�h͗{p�Oj"�A���ʫ8�4�B9!������ݯ-_��ʛ�� RP}t�Y7�uV�����ޙ���V��5\�(��o�)�N��x�e�sc�>eu��4,����D_/������i5��ȁ�T���he��_ZC�"��ޟI�����/�a�#�n(c��a-ד�u�]}��UC�w������7�B���:�W�t���WU�Tʊ��J&I���tO���&���f������s򻴨��)�����?�mѓ�`�W��]>��W�8yhah�vE�k��S iΪ/TE1]#ӭռkz�Y���U�!�&Q&W-G�Fxud�rO�M������f�އ�� � ��$:y�P��H>�Oq$٦%���Z�;�P+�7����g�.t����\س:��0_�������>�Okj;��g�J ��-�C(�YsF��m���������_������<L�h      s   6  x�m�MO�@E��_�K�ӏ�4����$l�tJ����Qc���ܼ��w0�*�{��F�I;�t;<��b{g��Q,T^�%��h�/˝��N_�u��;�g����Y-�DhY]LML=�<jC�J���f�!�-�r�N4]����=��*��aU����y�q^HD)ef&��K�\Jo�DY��������d�7i4D�r�7��u5��&o0r�P`�e�:�E	�?A IYB	3(ש,D-L_�j�2�K��W�{ȅ��8�G�1hc���O���>�.��Z@�0> k_n�     