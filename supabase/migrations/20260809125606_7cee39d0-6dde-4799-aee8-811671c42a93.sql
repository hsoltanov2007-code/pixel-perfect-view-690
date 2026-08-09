CREATE POLICY "service_role_all_product_images"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');