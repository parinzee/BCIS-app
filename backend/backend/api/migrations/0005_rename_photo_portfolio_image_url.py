# Generated by Django 4.0.5 on 2022-07-22 09:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_activity_content_alter_news_content_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='portfolio',
            old_name='photo',
            new_name='image_URL',
        ),
    ]
