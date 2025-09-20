--
-- PostgreSQL database dump
--

-- Dumped from database version 14.18 (Debian 14.18-1.pgdg120+1)
-- Dumped by pg_dump version 14.18 (Debian 14.18-1.pgdg120+1)

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

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, "userName", email, password, role, "allowedGroups", created_at, updated_at) FROM stdin;
2	saanika	saanika@tidalwave.tech	$2b$10$bQHyVn4BrS8cd/Wfyp560eiDNDtSQa4URJAlKiXMd.N6fuhJ6fMSi	admin	[]	2025-07-29 09:42:54.829979+00	2025-07-29 09:42:54.829979+00
1	admin	admin@admin.com	$2b$10$w3fnY.RtsRi4UeHsDeJ3W.EInLb8bbj1xSecheUKVsn1x2I7d1PhO	superAdmin	[]	2025-07-29 09:42:12.018248+00	2025-07-29 09:42:12.018248+00
3	vigiledge	samarth@tidalwave.tech	$2b$10$Q1CMuOUxsERiQCtEFJIktejuBsU4DyAjXXUROC7BH9dmMcVe.DZnG	monitor	[]	2025-07-29 10:39:38.85832+00	2025-07-29 10:39:38.85832+00
5	developer	developer@tidalwave.tech	$2b$10$wiiLCEmKucmOzHTIWdp/3.I.PRnOZ4FyX6UBI3Z8HXPWQVVxoJ7gW	associate	[]	2025-08-06 17:10:01.263984+00	2025-08-06 17:10:01.263984+00
4	rahul	rahul@tidalwave.tech	$2b$10$WTVTB4oAnsXYLzylHW4wyuCQwA8AUHTIOmbZWZHqF23w5ibXOuglu	admin	[]	2025-07-31 16:15:45.788613+00	2025-07-31 16:15:45.788613+00
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- PostgreSQL database dump complete
--

