# Generated by Django 4.2.4 on 2023-09-01 15:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0013_remove_admin_is_staff_remove_admin_is_superuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='subject',
            name='gradelvl_id',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='database.gradelevel'),
        ),
    ]
