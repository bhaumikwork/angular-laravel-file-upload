<?php
namespace App;
use Eloquent;

class Upload extends Eloquent
{
	protected $table = "files";

	protected $guarded = array('id');

}