# Generated by Django 4.2.4 on 2023-09-30 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0006_alter_studentgrade_initial_grade_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='admin',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='admin_profiles/'),
        ),
    ]
