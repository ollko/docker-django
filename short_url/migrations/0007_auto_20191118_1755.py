# Generated by Django 2.1.7 on 2019-11-18 14:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('short_url', '0006_auto_20190705_1355'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='url',
            options={'ordering': ['-created'], 'verbose_name': 'Пара', 'verbose_name_plural': 'Параы'},
        ),
    ]
