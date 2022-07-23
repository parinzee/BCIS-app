# Generated by Django 4.0.5 on 2022-07-23 05:03

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_parent_user_remove_pushid_user_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='name')),
                ('email', models.EmailField(max_length=254, verbose_name='email')),
                ('user_type', models.CharField(choices=[('S', 'Student'), ('P', 'Parent'), ('T', 'Teacher/Staff')], max_length=1, verbose_name='user type')),
                ('department', models.CharField(blank=True, choices=[('K', 'Kindergarten'), ('E', 'Elementary'), ('H', 'Highschool')], max_length=2, null=True, verbose_name='department')),
                ('team_color', models.CharField(blank=True, choices=[('R', 'Red Team'), ('G', 'Green Team'), ('B', 'Blue Team'), ('Y', 'Yellow Team')], max_length=1, null=True, verbose_name='team color')),
            ],
        ),
        migrations.CreateModel(
            name='GPAScore',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_added', models.DateTimeField(verbose_name='date added')),
                ('gpa', models.DecimalField(decimal_places=3, max_digits=5, verbose_name='cumulative gpa')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.appuser')),
            ],
        ),
        migrations.DeleteModel(
            name='Parent',
        ),
        migrations.DeleteModel(
            name='Staff',
        ),
        migrations.DeleteModel(
            name='Student',
        ),
    ]