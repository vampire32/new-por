-- Swap an item's sort_order with its neighbour in one round trip and one transaction.
-- security invoker: RLS still applies, so only the admin can actually move anything.
create function move_item(tbl text, item_id uuid, direction text) returns void
language plpgsql security invoker set search_path = public
as $$
declare
  scope_col text;
  cur record;
  other record;
  scope_filter text := '';
begin
  if tbl not in ('projects','experience','skill_categories','services','testimonials','skills','project_images') then
    raise exception 'cannot reorder %', tbl;
  end if;
  if direction not in ('up','down') then
    raise exception 'bad direction %', direction;
  end if;
  scope_col := case tbl when 'skills' then 'category_id' when 'project_images' then 'project_id' end;

  if scope_col is null then
    execute format('select id, sort_order, null::uuid as scope from %I where id = $1', tbl) into cur using item_id;
  else
    execute format('select id, sort_order, %I as scope from %I where id = $1', scope_col, tbl) into cur using item_id;
    scope_filter := format(' and %I = $2', scope_col);
  end if;
  if cur.id is null then return; end if;

  execute format(
    'select id, sort_order from %I where sort_order %s $1%s order by sort_order %s limit 1',
    tbl,
    case direction when 'up' then '<' else '>' end,
    scope_filter,
    case direction when 'up' then 'desc' else 'asc' end
  ) into other using cur.sort_order, cur.scope;
  if other.id is null then return; end if;

  execute format('update %I set sort_order = $1 where id = $2', tbl) using other.sort_order, cur.id;
  execute format('update %I set sort_order = $1 where id = $2', tbl) using cur.sort_order, other.id;
end $$;
