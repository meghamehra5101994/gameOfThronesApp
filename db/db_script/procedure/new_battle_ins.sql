CREATE OR REPLACE FUNCTION public.new_battle_ins(
in_id integer,
in_year character varying,
in_battle_number character varying,
in_attacker_king character varying,
in_defender_king character varying,
in_attacker_1 character varying,
in_attacker_2 character varying,
in_attacker_3 character varying,
in_attacker_4 character varying,
in_defender_1 character varying,
in_defender_2 character varying,
in_defender_3 character varying,
in_defender_4 character varying,
in_attacker_outcome character varying,
in_battle_type character varying,
in_major_death character varying,
in_major_capture character varying,
in_attacker_Size character varying,
in_defender_size character varying,
in_attacker_commander character varying,
in_defender_commander character varying,
in_summer character varying,
in_location character varying,
in_region character varying,
in_note character varying,
OUT out_error_code integer)
RETURNS integer
LANGUAGE 'plpgsql'
COST 100.0
VOLATILE NOT LEAKPROOF 
AS $function$

DECLARE 

---insert in transaction log BEGIN---	
BEGIN
out_error_code := 0; --error code for successful transaction
--sql insert query to insert in logs
---insert in transaction log END---
INSERT INTO battle_def(
year ,
battle_number ,
attacker_king ,
defender_king ,
attacker_1 ,
attacker_2 ,
attacker_3 ,
attacker_4 ,
defender_1 ,
defender_2 ,
defender_3 ,
defender_4 ,
attacker_outcome ,
battle_type ,
major_death ,
major_capture ,
attacker_Size ,
defender_size ,
attacker_commander ,
defender_commander ,
summer ,
location ,
region ,
note 
) VALUES(
in_year ,
in_battle_number ,
in_attacker_king ,
in_defender_king ,
in_attacker_1 ,
in_attacker_2 ,
in_attacker_3 ,
in_attacker_4 ,
in_defender_1 ,
in_defender_2 ,
in_defender_3 ,
in_defender_4 ,
in_attacker_outcome ,
in_battle_type ,
in_major_death ,
in_major_capture ,
in_attacker_Size ,
in_defender_size ,
in_attacker_commander ,
in_defender_commander ,
in_summer ,
in_location ,
in_region ,
in_note 
);


END;

$function$;

