# Generated by Django 4.0.5 on 2022-07-22 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_featured'),
    ]

    operations = [
        migrations.CreateModel(
            name='Portfolio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50, verbose_name='title')),
                ('content', models.TextField(max_length=100, verbose_name='conent')),
                ('date_updated', models.DateTimeField(verbose_name='thumbnail_url')),
                ('photo', models.FileField(upload_to='', verbose_name='photo')),
            ],
        ),
    ]