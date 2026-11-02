-- Total projects delivered (e.g. 200), shown as a home page stat instead of the number of case studies.
alter table profile add column if not exists projects_delivered int;
