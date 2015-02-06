<?php namespace App\Http\Controllers;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use File;
use App\Upload;
class FilesController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		//
		$oFiles = Upload::all();
		$oFiles->each(function($oFile){
			$oFile->url = action('FilesController@show',array($oFile->id));
			unset($oFile->path);
		});

		return response()->json($oFiles->toArray());
	}



	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store(Request $request)
	{
		//
		if( ! $request->hasFile('file') )
			return response()->json(['error'=>['message'=>'file not found']],404);
		$oUploadedFile = $request->file('file');
		$oUploadedFile->move(base_path()."/uploads",$oUploadedFile->getClientOriginalName());
		$oFile = Upload::create([
					'name'			=>	$oUploadedFile->getClientOriginalName(),
					'ext'			=>	$oUploadedFile->getClientOriginalExtension(),
					'path'			=>	'/uploads'
				]);
		$oFile->url = action('FilesController@show',array($oFile->id));
		unset($oFile->path);
		return response()->json($oFile->toArray());
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
		$oFile = Upload::find($id);
		if( ! $oFile )
			return response()->json(['error'=>['message'=>'file not found!']],404);

		if( ! File::exists(base_path().$oFile->path."/".$oFile->name) )
			return response()->json(['error'=>['message'=>'file not found']],404);

		return File::get(base_path().$oFile->path."/".$oFile->name);
	}



	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		$oFile = Upload::find($id);
		if( ! $oFile )
			return response()->json(['error'=>['message'=>'file not found']],404);

		File::delete(base_path().$oFile->path."/".$oFile->name);
		$oFile->delete();
		return response()->json(['success'=>1,'message'=>'file deleted']);
	}

}
