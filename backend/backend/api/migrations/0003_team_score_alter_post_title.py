# Generated by Django 4.0.5 on 2022-07-06 07:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_post'),
    ]

    operations = [
        migrations.CreateModel(
            name='Team_Score',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.BigIntegerField(verbose_name='score')),
                ('team_color', models.CharField(choices=[('R', 'Red Team'), ('G', 'Green Team'), ('B', 'Blue Team'), ('Y', 'Yellow Team')], max_length=1, verbose_name='team color')),
                ('department', models.CharField(choices=[('E', 'Elementary'), ('H', 'Highschool')], max_length=2, verbose_name='department')),
            ],
        ),
        migrations.AlterField(
            model_name='post',
            name='title',
            field=models.CharField(max_length=50, verbose_name='title'),
        ),
    ]
