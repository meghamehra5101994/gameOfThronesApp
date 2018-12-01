CREATE OR REPLACE FUNCTION public.get_status()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE 
data1 text;
data2 text;	
data3 text;
data4 text;
data5 text;
data6 text;
data7 text;
most_active text;
attacker_outcomes text;
result text;
Begin

    data1:=  (SELECT array_to_json(array_agg(row)) FROM (
        (select attacker_king
        from battle_def group by attacker_king having count(attacker_king) =
        (select max(total) as highest_total from (
        select attacker_king,count(attacker_king) as total from battle_def group by attacker_king) as t))) row);

    data2:=  (SELECT array_to_json(array_agg(row)) FROM (
        (select defender_king
        from battle_def group by defender_king having count(defender_king) =
        (select max(total) as highest_total from (
        select defender_king,count(defender_king) as total from battle_def group by defender_king) as t))) row);

    data3:=  (SELECT array_to_json(array_agg(row)) FROM (
        (select region
        from battle_def group by region having count(region) =
        (select max(total) as highest_total from (
        select region,count(region) as total from battle_def group by region) as t))) row);



	data4:= (SELECT array_to_json(array_agg(row)) FROM (
    (select count(*) as win from battle_def where lower(attacker_outcome)='win'))row);

    data5:=(SELECT array_to_json(array_agg(row)) FROM (
     (select count(*) as loss from battle_def where lower(attacker_outcome)='loss'))row);

    data6:= (SELECT array_to_json(array_agg(row)) FROM (
        (select distinct battle_type from battle_Def))row);     

    data7:=  (SELECT array_to_json(array_agg(row)) FROM (
      (select avg(cast(coalesce(nullif(defender_size,''),'0') as integer)) as average,
        min(cast(coalesce(nullif(defender_size,''),'0') as integer)) as minimum,
        max(cast(coalesce(nullif(defender_size,''),'0') as integer)) as maximum from battle_def)) row);

   most_active := '[' || coalesce(data1, '[]')||',
		 ' || coalesce(data2, '[]')||','|| coalesce(data3,'[]') ||']';

   attacker_outcomes := '[' || coalesce(data4, '[]')||',' || coalesce(data5, '[]')||']';
		   
	

	result:= '{"most_active":' ||coalesce(most_active, '[]')||', "attacker_outcomes":'||coalesce(attacker_outcomes, '[]')||',
     "battle_types":'||coalesce(data6, '[]')||', "size":' ||coalesce(data7, '[]')||'}';
	

	return result;
	
end
$function$