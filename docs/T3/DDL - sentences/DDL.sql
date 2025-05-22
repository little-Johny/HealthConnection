CREATE TYPE public.enum_appointment_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'canceled'
);

CREATE TYPE public.enum_clinical_histories_blood_type AS ENUM (
    'A+',
    'A-',
    'B+',
    'B-',
    'O+',
    'O-',
    'AB+',
    'AB-'
);

CREATE TYPE public.enum_doctor_schedule_block_reason AS ENUM (
    'appintment',
    'appointment',
    'break',
    'meeting'
);

CREATE TYPE public.enum_doctor_schedule_day_of_week AS ENUM (
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
);

CREATE TYPE public.enum_undefined_role AS ENUM (
    'admin',
    'staff',
    'doctor',
    'patient'
);

CREATE TYPE public.enum_user_role AS ENUM (
    'admin',
    'staff',
    'doctor',
    'patient'
);

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);

CREATE TABLE public.appointment (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    speciality_id integer NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    price numeric(10,2) NOT NULL,
    status public.enum_appointment_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.appointment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.appointment_id_seq OWNED BY public.appointment.id;

CREATE TABLE public.clinical_histories (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    blood_type public.enum_clinical_histories_blood_type NOT NULL,
    weight double precision,
    height double precision,
    chronic_diseases text,
    allergies text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.clinical_histories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.clinical_histories_id_seq OWNED BY public.clinical_histories.id;

CREATE TABLE public.doctor (
    id integer NOT NULL,
    user_id integer NOT NULL,
    speciality_id integer NOT NULL,
    license_number character varying(255) NOT NULL,
    consultation_fee numeric(10,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.doctor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.doctor_id_seq OWNED BY public.doctor.id;

CREATE TABLE public.doctor_schedule (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    day_of_week public.enum_doctor_schedule_day_of_week NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE TABLE public.doctor_schedule_block (
    id integer NOT NULL,
    doctor_id integer NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    reason public.enum_doctor_schedule_block_reason NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.doctor_schedule_block_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.doctor_schedule_block_id_seq OWNED BY public.doctor_schedule_block.id;

CREATE SEQUENCE public.doctor_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.doctor_schedule_id_seq OWNED BY public.doctor_schedule.id;

CREATE TABLE public.observation (
    id integer NOT NULL,
    clinical_history_id integer NOT NULL,
    doctor_id integer NOT NULL,
    diagnosis text NOT NULL,
    treatment text,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.observation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.observation_id_seq OWNED BY public.observation.id;

CREATE TABLE public.patient (
    id integer NOT NULL,
    user_id integer NOT NULL,
    birthdate timestamp with time zone NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.patient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.patient_id_seq OWNED BY public.patient.id;

CREATE TABLE public.post (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    image character varying(255),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;

CREATE TABLE public.recovery_log (
    id integer NOT NULL,
    user_id integer NOT NULL,
    requested_at timestamp with time zone NOT NULL,
    ip_address character varying(255),
    user_agent character varying(255)
);

CREATE SEQUENCE public.recovery_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.recovery_log_id_seq OWNED BY public.recovery_log.id;

CREATE TABLE public.specialities (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

CREATE SEQUENCE public.specialities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.specialities_id_seq OWNED BY public.specialities.id;

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    photo character varying(255),
    type_document character varying(255) NOT NULL,
    number_document character varying(255) NOT NULL,
    gender character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role public.enum_user_role NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    phone character varying(255),
    recovery_token character varying(255) DEFAULT NULL::character varying
);

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
    
ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;

ALTER TABLE ONLY public.appointment ALTER COLUMN id ALTER TABLE ONLY public.clinical_histories ALTER COLUMN id ALTER TABLE ONLY public.doctor ALTER COLUMN id ALTER TABLE ONLY public.doctor_schedule ALTER COLUMN id ALTER TABLE ONLY public.doctor_schedule_block ALTER COLUMN id ALTER TABLE ONLY public.observation ALTER COLUMN id ALTER TABLE ONLY public.patient ALTER COLUMN id ALTER TABLE ONLY public.post ALTER COLUMN id ALTER TABLE ONLY public.recovery_log ALTER COLUMN id ALTER TABLE ONLY public.specialities ALTER COLUMN id ALTER TABLE ONLY public."user" ALTER COLUMN id ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);
    
ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.clinical_histories
    ADD CONSTRAINT clinical_histories_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_license_number_key UNIQUE (license_number);
    
ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.doctor_schedule_block
    ADD CONSTRAINT doctor_schedule_block_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.doctor_schedule
    ADD CONSTRAINT doctor_schedule_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.observation
    ADD CONSTRAINT observation_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.recovery_log
    ADD CONSTRAINT recovery_log_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.specialities
    ADD CONSTRAINT specialities_name_key UNIQUE (name);
    
ALTER TABLE ONLY public.specialities
    ADD CONSTRAINT specialities_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public.doctor_schedule
    ADD CONSTRAINT unique_doctor_day UNIQUE (doctor_id, day_of_week);
    
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
    
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
    
ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
    
ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.appointment
    ADD CONSTRAINT appointment_speciality_id_fkey FOREIGN KEY (speciality_id) REFERENCES public.specialities(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.clinical_histories
    ADD CONSTRAINT clinical_histories_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(id) ON DELETE CASCADE;
    
ALTER TABLE ONLY public.doctor_schedule_block
    ADD CONSTRAINT doctor_schedule_block_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.doctor_schedule
    ADD CONSTRAINT doctor_schedule_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.doctor_schedule
    ADD CONSTRAINT doctor_schedule_doctor_id_fkey1 FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON UPDATE CASCADE ON DELETE CASCADE;
    
ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_speciality_id_fkey FOREIGN KEY (speciality_id) REFERENCES public.specialities(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.observation
    ADD CONSTRAINT observation_clinical_history_id_fkey FOREIGN KEY (clinical_history_id) REFERENCES public.clinical_histories(id);
    
ALTER TABLE ONLY public.observation
    ADD CONSTRAINT observation_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id);
    
ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE ALTER TABLE ONLY public.recovery_log
    ADD CONSTRAINT recovery_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;
    