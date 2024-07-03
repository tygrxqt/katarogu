CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


create policy "Give everyone access to profile assets 1ige2ga_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'profiles'::text));


create policy "Give users access to own folder 1ige2ga_0"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'profiles'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1ige2ga_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'profiles'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1ige2ga_2"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'profiles'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));


create policy "Give users access to own folder 1ige2ga_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'profiles'::text) AND (( SELECT (auth.uid())::text AS uid) = (storage.foldername(name))[1])));



