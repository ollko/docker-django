
from django.db import models

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


class Video(models.Model):
    name = models.CharField(max_length = 100)

    def __str__(self):
        return self.name


class Article(models.Model):
    name = models.CharField(max_length = 100)

    def __str__(self):
        return self.name

class MainPageBlock(models.Model):
    BLOCK_TYPES = (
        ('1', 'Обычный блок (изображение, текст)'),
        ('2', 'Цитата'),
        ('3', 'Средний блок'),
        ('4', 'Средний квадратный блок'),
        ('5', 'Большой блок'),
        ('6', 'Фотореп блок'),
        ('7', 'Широкий блок с новостями'),
        ('8', 'Эволюция'),
        ('9', 'Колонка с новостями'),
        ('10', 'Блок-баннер'),
        ('11', 'Блок-баннер для адаптива'),
    )
    block_type = models.IntegerField(
        verbose_name=u'Тип блока',
        choices = BLOCK_TYPES,
        default = 1,
    )
    def add_item(self, item):
        item_content_type = ContentType.objects.get_for_model(item)
        return BlockItem.objects.create(
            mainpageblock = self,
            content_content_type = item_content_type,
            content_object_id = item.pk,
        )


class BlockItem(models.Model):
    mainpageblock = models.ForeignKey(
        MainPageBlock,
        on_delete = models.CASCADE,
        related_name = 'items',
        )
    content_object_id = models.IntegerField()
    content_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.PROTECT,
    )
    content = GenericForeignKey(
        'content_content_type',
        'content_object_id',
    )

    # def __str__(self):
    #     return str(self.order)

# class BaseMatrixBlock(models.Model):
#     BLOCK_TYPES = (
#         ('1', 'Обычный блок (изображение, текст)'),
#         ('2', 'Цитата'),
#         ('3', 'Средний блок'),
#         ('4', 'Средний квадратный блок'),
#         ('5', 'Большой блок'),
#         ('6', 'Фотореп блок'),
#         ('7', 'Широкий блок с новостями'),
#         ('8', 'Эволюция'),
#         ('9', 'Колонка с новостями'),
#         ('10', 'Блок-баннер'),
#         ('11', 'Блок-баннер для адаптива'),
#     )
#     order = models.PositiveIntegerField(
#         verbose_name=u'Сортировка',
#         default=0,
#     )
#     inner_title = models.CharField(
#         max_length=255,
#         verbose_name='Внутреннее название',
#         blank=True,
#         null=True,
#     )
#     block_type = models.CharField(
#         max_length=255,
#         verbose_name = 'Тип блока',
#         choices = BLOCK_TYPES,
#         default = '1',
#     )
#     content_object_id = models.IntegerField()
#     content_content_type = models.ForeignKey(
#         ContentType,
#         on_delete=models.PROTECT,
#     )
#     content = GenericForeignKey(
#         'content_content_type',
#         'content_object_id',
#     )

#     class Meta:
#         ordering = ['order']

#     def __str__(self):
#         return str(self.order)
