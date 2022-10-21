--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: events; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.events (
    id uuid NOT NULL,
    type character varying,
    date timestamp without time zone,
    payload jsonb
);


ALTER TABLE public.events OWNER TO "user";

--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.events (id, type, date, payload) FROM stdin;
45970127-aa7d-4bff-8afe-5fbed32e98bd	ListCreated	2022-09-07 11:46:00	{"name": "Saved articles", "listId": "list-id-931653361", "ownerId": "user-id:931653361", "description": "Articles that have been saved by @DavidAshbrook."}
895a2d62-8c9d-492e-86d7-b244377c9103	ListCreated	2021-11-22 15:09:00	{"name": "Endorsed articles", "listId": "5ac3a439-e5c6-4b15-b109-92928a740812", "ownerId": "group-id:4bbf0c12-629b-4bb8-91d6-974f4df8efb2", "description": "Articles that have been endorsed by Biophysics Colab."}
45808b66-7a47-4112-a212-7b10aebfca2b	ListCreated	2021-11-24 00:00:00	{"name": "High interest articles", "listId": "cbd478fe-3ff7-4125-ac9f-c94ff52ae0f7", "ownerId": "group-id:62f9b0d0-8d43-4766-a52a-ce02af61bc6a", "description": "Articles that have been identified as high interest by NCRC editors."}
5e38299d-26de-4873-bac7-459c1bc37e02	ListCreated	2022-10-11 00:00:00	{"name": "Evaluated articles", "listId": "5498e813-ddad-414d-88df-d1f84696cecd", "ownerId": "group-id:d6e1a913-76f8-40dc-9074-8eac033e1bc8", "description": "Articles that have been evaluated by GigaScience."}
09ffa277-9223-4165-8dfb-f57083e9826f	UserSavedArticle	2022-10-03 19:08:52.765	{"userId": "56806677", "articleId": "doi:10.1101/2022.10.01.510447"}
b87cb3a0-0eaa-4794-bf11-538accf03f9e	ListCreated	2022-10-07 10:45:34.144	{"name": "@BlueReZZ's saved articles", "listId": "f64c15a3-b125-4d86-8de8-9fd21dd7dd7c", "ownerId": "user-id:56806677", "description": "Articles that have been saved by @BlueReZZ"}
\.


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

