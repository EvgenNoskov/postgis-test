CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS public.markers
(
    id SERIAL NOT NULL,
    label character varying(255),
    geom geometry(Point,4326),
    CONSTRAINT markers_pkey PRIMARY KEY (id)
);