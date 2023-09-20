# Generated by Django 4.2.4 on 2023-09-20 08:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0020_alter_student_mname'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='assigned',
            unique_together={('subject_id', 'dept_id', 'gradelvl_id', 'section_id')},
        ),
        migrations.CreateModel(
            name='StudentGrade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('assignment_name', models.CharField(max_length=50)),
                ('ww_score_1', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_2', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_3', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_4', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_5', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_6', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_7', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_8', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_9', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_score_10', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_total_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_percentage_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('ww_weighted_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_1', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_2', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_3', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_4', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_5', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_6', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_7', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_8', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_9', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_score_10', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_total_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_percentage_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('pt_weighted_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('qa_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('qa_percentage_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('qa_weighted_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('initial_grade', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('quarterly_grade', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.student')),
                ('subject', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='database.subject')),
            ],
        ),
    ]
