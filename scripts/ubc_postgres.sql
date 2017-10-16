--
-- PostgreSQL database dump
--

-- Dumped from database version 8.1.23
-- Dumped by pg_dump version 9.0.3
-- Started on 2017-07-12 07:17:39
CREATE ROLE esmbackend WITH LOGIN PASSWORD '';
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

--
-- TOC entry 1558 (class 1262 OID 752617)
-- Name: msp_monitor; Type: DATABASE; Schema: -; Owner: esmbackend
--

CREATE DATABASE msp_monitor WITH TEMPLATE = template0 ENCODING = 'UTF8';


ALTER DATABASE msp_monitor OWNER TO esmbackend;

\connect msp_monitor

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = off;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET escape_string_warning = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 1221 (class 1259 OID 752632)
-- Dependencies: 1545 5
-- Name: msp_company; Type: TABLE; Schema: public; Owner: esmbackend; Tablespace:
--

CREATE TABLE msp_company (
    company_recid integer DEFAULT nextval(('pk_msp_company_recid'::text)::regclass) NOT NULL,
    company_id character varying(50) NOT NULL,
    company_name character varying(50) NOT NULL,
    phone_number character varying(15),
    contact_first_name character varying(30),
    contact_last_name character varying(30)
);


ALTER TABLE public.msp_company OWNER TO esmbackend;

--
-- TOC entry 1223 (class 1259 OID 752647)
-- Dependencies: 1547 5
-- Name: msp_device; Type: TABLE; Schema: public; Owner: esmbackend; Tablespace:
--

CREATE TABLE msp_device (
    device_recid integer DEFAULT nextval(('pk_msp_device_recid'::text)::regclass) NOT NULL,
    device_id character varying(60) NOT NULL,
    manufacturer character varying(50),
    description character varying(60),
    device_type character varying(30),
    mac_address character varying(17),
    ip_address character varying(45) NOT NULL,
    site_recid integer NOT NULL
);


ALTER TABLE public.msp_device OWNER TO esmbackend;

--
-- TOC entry 1222 (class 1259 OID 752637)
-- Dependencies: 1546 5
-- Name: msp_site; Type: TABLE; Schema: public; Owner: esmbackend; Tablespace:
--

CREATE TABLE msp_site (
    site_recid integer DEFAULT nextval(('pk_msp_site_recid'::text)::regclass) NOT NULL,
    company_recid integer NOT NULL,
    description character varying(50),
    address1 character varying(50),
    address2 character varying(50),
    city character varying(50),
    province character varying(50),
    postal_code character varying(12),
    latitude character varying(12),
    longitude character varying(12)
);

CREATE TABLE msp_data_capture (
    id BIGSERIAL PRIMARY KEY,
    device_recid integer NOT NULL,
    latency_milliseconds decimal,
    responded boolean,
    date_recorded timestamp without time zone DEFAULT (now() at time zone 'utc'),
    FOREIGN KEY (device_recid) REFERENCES msp_device (device_recid)
);

ALTER TABLE public.msp_site OWNER TO esmbackend;

--
-- TOC entry 1218 (class 1259 OID 752618)
-- Dependencies: 5
-- Name: pk_msp_company_recid; Type: SEQUENCE; Schema: public; Owner: esmbackend
--

CREATE SEQUENCE pk_msp_company_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_company_recid OWNER TO esmbackend;

--
-- TOC entry 1220 (class 1259 OID 752622)
-- Dependencies: 5
-- Name: pk_msp_device_recid; Type: SEQUENCE; Schema: public; Owner: esmbackend
--

CREATE SEQUENCE pk_msp_device_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pk_msp_device_recid OWNER TO esmbackend;

--
-- TOC entry 1219 (class 1259 OID 752620)
-- Dependencies: 5
-- Name: pk_msp_site_recid; Type: SEQUENCE; Schema: public; Owner: esmbackend
--

CREATE SEQUENCE pk_msp_site_recid
    START WITH 1000
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.pk_msp_site_recid OWNER TO esmbackend;

--
-- TOC entry 1549 (class 2606 OID 752636)
-- Dependencies: 1221 1221
-- Name: msp_company_pkey; Type: CONSTRAINT; Schema: public; Owner: esmbackend; Tablespace:
--

ALTER TABLE ONLY msp_company
    ADD CONSTRAINT msp_company_pkey PRIMARY KEY (company_recid);


--
-- TOC entry 1553 (class 2606 OID 752651)
-- Dependencies: 1223 1223
-- Name: msp_device_pkey; Type: CONSTRAINT; Schema: public; Owner: esmbackend; Tablespace:
--

ALTER TABLE ONLY msp_device
    ADD CONSTRAINT msp_device_pkey PRIMARY KEY (device_recid);


--
-- TOC entry 1551 (class 2606 OID 752641)
-- Dependencies: 1222 1222
-- Name: msp_site_pkey; Type: CONSTRAINT; Schema: public; Owner: esmbackend; Tablespace:
--

ALTER TABLE ONLY msp_site
    ADD CONSTRAINT msp_site_pkey PRIMARY KEY (site_recid);


--
-- TOC entry 1555 (class 2606 OID 752652)
-- Dependencies: 1223 1222 1550
-- Name: msp_device_site_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: esmbackend
--

ALTER TABLE ONLY msp_device
    ADD CONSTRAINT msp_device_site_recid_fkey FOREIGN KEY (site_recid) REFERENCES msp_site(site_recid) ON DELETE RESTRICT;


--
-- TOC entry 1554 (class 2606 OID 752642)
-- Dependencies: 1222 1221 1548
-- Name: msp_site_company_recid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: esmbackend
--

ALTER TABLE ONLY msp_site
    ADD CONSTRAINT msp_site_company_recid_fkey FOREIGN KEY (company_recid) REFERENCES msp_company(company_recid) ON DELETE RESTRICT;


--
-- TOC entry 1560 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;



-- Completed on 2017-07-12 07:17:40

--
-- PostgreSQL database dump complete
--

