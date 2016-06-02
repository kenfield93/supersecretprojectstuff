CREATE OR REPLACE FUNCTION proc_insert_orders(queries INT, new INT) RETURNS void AS $$
DECLARE
   priceList FLOAT[];
   productList INTEGER[];
   idx INT;
   diff INT;
   tables CURSOR FOR SELECT p.id, sum(o.price) as sum FROM orders o, product_items p WHERE o.product_id = p.id group by p.id order by sum desc limit 50 + new;
BEGIN
   idx := 0;
   FOR table_record IN tables LOOP
      priceList[idx] := table_record.sum;
      productList[idx] := table_record.id;
      idx := idx + 1;
   END LOOP;

   for a in 1..new LOOP
      diff := priceList[50-a] - priceList[50-a+new] + 1;
      INSERT INTO ORDERS(user_id, product_id, quantity, price, is_cart) VALUES(random() * 100 + 1, productList[50-a+new], 1, diff, false);
   END LOOP;
   for a in 0..queries-new-1 LOOP
      INSERT INTO ORDERS(user_id, product_id, quantity, price, is_cart) VALUES(random() * 100 + 1, productList[a % (50-new)], 1, 100, false);
   END LOOP;
END;
$$ LANGUAGE plpgsql;n