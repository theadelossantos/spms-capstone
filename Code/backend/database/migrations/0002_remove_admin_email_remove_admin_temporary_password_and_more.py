# Generated by Django 4.2.4 on 2023-08-18 09:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='admin',
            name='email',
        ),
        migrations.RemoveField(
            model_name='admin',
            name='temporary_password',
        ),
        migrations.RemoveField(
            model_name='student',
            name='email',
        ),
        migrations.RemoveField(
            model_name='student',
            name='temporary_password',
        ),
        migrations.RemoveField(
            model_name='teacher',
            name='email',
        ),
    ]
