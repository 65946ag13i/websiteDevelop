"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const repairPage: React.FC = () => {
  const session = useSession();

  //----前言開關-----
  const [isOpen, setOpen] = useState(true); //前言
  const toggleAccordion = () => {
    setOpen(!isOpen);
  }; // 前言開關
  //----前言開關-----

  //----相片上傳後顯示控制-----
  const [filePhoto, setFilePhoto] = useState<{ file: File; name: string }[]>(
    []
  ); //後端照片上傳儲存

  const fileHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    // console.log("照片上傳陣列" + JSON.stringify(files, null, 3));
    // console.dir(files, { depth: null });
    if (files && filePhoto.length === 0) {
      const fileArray = Array.from(files).map((file) => {
        return { file, name: file.name };
      });
      setFilePhoto(fileArray);
    } else if (files && filePhoto.length > 0) {
      const fileArray = Array.from(files).map((file) => {
        return { file, name: file.name };
      });
      setFilePhoto([...filePhoto, ...fileArray]);
    }
    // if (files) {
    //儲存照片資訊到對象
    // console.log("顯示照片陣列");
    // console.log(fileArray);
    // setFilePhoto(fileArray); //陣列存起來

    // const photoURL = fileArray.map((file) => {
    //   return URL.createObjectURL(file.file);
    // });
    // console.log("顯示URL" + photoURL);
    // setPhotoURL(photoURL);
    // }
  }; //照片預覽及存儲

  const fileDelete = (index: number) => {
    setFilePhoto(filePhoto.filter((_, number) => number !== index));
  }; //照片刪除
  //----相片上傳後顯示控制-----

  //----日曬checkbox-----
  const [selectedOption, setSelectedOption] = useState<string>("no");
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    console.log(e.target.value);
    console.log(selectedOption); //這裡是異步的所以結果還沒fulfilled要用useEffect
  };
  //----日曬checkbox-----

  //----品牌選擇-----
  const [conditionerSelectedOption, setconditionerSelectedOption] = useState<
    string[]
  >([]);
  const conditionerCheckboxHandle = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (conditionerSelectedOption.includes(value)) {
      setconditionerSelectedOption(
        conditionerSelectedOption.filter((filter) => {
          return filter !== value;
        })
      );
    } else {
      setconditionerSelectedOption([...conditionerSelectedOption, value]);
    }
  }; //e傳進來是value  傳入option(str) 改變check(boolean)
  //----品牌選擇-----

  useEffect(() => {
    console.log("刪除結果:" + conditionerSelectedOption);
  }, [conditionerSelectedOption]);

  //-----坪數大小設置-----

  //每填一個數值直接重設每個格子比較快，寫太複雜
  const [squareMeter, setsquareMeter] = useState<string | number>("");
  const [ping, setping] = useState<string | number>("");

  const handleSquareMeterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);

    if (!isNaN(value)) {
      setsquareMeter(value);
    } else {
      setsquareMeter("");
    }

    if (!isNaN(value)) {
      setping((value / 3.305785).toFixed(2));
      setlength("");
      setwidth("");
    } else {
      setping("");
    }
  };

  const handlePingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setping(value);
    } else {
      setping("");
    }

    if (!isNaN(value)) {
      setsquareMeter((value * 3.305785).toFixed(2));
      setlength("");
      setwidth("");
    } else {
      setsquareMeter("");
    }
  };

  const [length, setlength] = useState<string | number>("");
  const [width, setwidth] = useState<string | number>("");

  const saveLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setlength(value);
  };

  const saveWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setwidth(value);
  };

  const squareCalculation = () => {
    const result = Number(length) * Number(width);
    return result;
  };

  useEffect(() => {
    const result = squareCalculation();
    if (!isNaN(result)) {
      setsquareMeter(result);
      setping((result / 3.305785).toFixed(2));
    } else {
      setping("");
    }
  }, [length, width]);

  useEffect(() => {
    console.log("effect結果:" + selectedOption);
    console.log("conditioner結果:" + conditionerSelectedOption);
  }, [selectedOption, conditionerSelectedOption]);

  //-----坪數大小設置-----

  console.log("顯示登入資訊:");
  console.dir(session, { depth: null });
  return (
    <>
      <div className="flex flex-col items-center  w-[80%] mx-auto min-h-screen">
        <div
          data-mark="前言塊"
          className="max-w-lg mx-auto bg-orange-400 overflow-"
        >
          <div className="text-center" onClick={toggleAccordion}>
            ▼ 前言 ▼
          </div>

          <div
            className={`overflow-hidden text-start ${isOpen ? "max-h-full" : "max-h-0"}`}
          >
            夏季工作較忙報價通常需7個工作天 <br />
            老闆身兼多職需要看現場估價裝冷氣維修 <br />
            工作繁忙時，無法馬上報價 <br />
            如太久沒報價可能是忘記了請通知老闆
            <br /> 報價資訊將會保留一年
          </div>
        </div>
        {/* {session ? <div>123</div> : <div>123</div>} */}
        <div>登入註冊</div>

        <div data-mark="報價模塊" className="flex  w-full ">
          <div className="w-1/5 bg-yellow-600">
            <div>新估價</div>
            <div>歷史估價</div>
            <div>修改密碼</div>
            <div>登出</div>
          </div>
          <div className="w-4/5  bg-blue-400">
            <div>簡易留言板?</div>
            <div>需要報價的品牌</div>

            <div>
              <label>
                <input
                  type="checkbox"
                  value="option1"
                  checked={conditionerSelectedOption.includes("option1")}
                  onChange={conditionerCheckboxHandle}
                />
                國際牌
              </label>

              <label>
                <input
                  type="checkbox"
                  value="option2"
                  checked={conditionerSelectedOption.includes("option2")}
                  onChange={conditionerCheckboxHandle}
                />
                日立
              </label>
              <label>
                <input
                  type="checkbox"
                  value="option3"
                  checked={conditionerSelectedOption.includes("option3")}
                  onChange={conditionerCheckboxHandle}
                />
                華菱
              </label>
            </div>

            <div>其他品牌也可以詢問:</div>
            <input type="textarea" />
            <div>輸入房間大小(長寬和平方公尺 選一組輸入)</div>
            <div>
              <label htmlFor="length">長:</label>
              <input
                type="number"
                id="length"
                value={length}
                onChange={saveLength}
              />
              <label htmlFor="width">寬:</label>
              <input
                type="number"
                id="width"
                value={width}
                onChange={saveWidth}
              />
              <label htmlFor="squareMeter">平方公尺:</label>
              <input
                type="number"
                id="squareMeter"
                value={squareMeter}
                onChange={handleSquareMeterChange}
              />
              <label htmlFor="squareMeter">坪數:</label>
              <input
                type="number"
                id="ping"
                value={ping}
                onChange={handlePingChange}
              />
            </div>
            {/* <div>
              <label htmlFor="gettingSunlight">
                房間牆面是否有太陽照射或是在最頂樓?
              </label>
              <input
                type="checkbox"
                id="gettingSunlight"
                checked={checked}
                onChange={gettingSunlightHandle}
              />
            </div> */}

            <div className="flex " data-mark="西曬">
              <div>房間牆面是否有太陽照射或是在最頂樓?</div>
              <div>
                <label>
                  是
                  <input
                    type="radio"
                    value="yes"
                    name="gettingSunlight"
                    checked={selectedOption === "yes"} //check=boolean=選中
                    onChange={handleOptionChange}
                  />
                </label>
              </div>
              <div>
                <label>
                  否
                  <input
                    type="radio"
                    value="no"
                    checked={selectedOption === "no"}
                    onChange={handleOptionChange}
                  />
                </label>
              </div>
            </div>

            <div className="w-[50%] mx-auto">
              {filePhoto &&
                filePhoto.map((item, index) => (
                  <div key={index}>
                    <Image
                      src={URL.createObjectURL(item.file)}
                      key={index + 1}
                      layout="responsive"
                      alt="上傳圖片預覽"
                      width={150}
                      height={100}
                    />
                    <div>圖片:{index + 1}</div>
                    <div>圖片名稱:{item.file.name}</div>
                    <button
                      onClick={() => fileDelete(index)}
                      className="bg-white"
                    >
                      刪除
                    </button>
                  </div>
                ))}
            </div>
            <div>
              <div>請盡量提供以下內容圖片，比較好報價</div>
              <div>
                <ol className="list-decimal">
                  <li>內機安裝位置</li>
                  <li>外機安裝位置(盡量拍攝大範圍，以評估施工難度)</li>
                  <li>內、外機排水位置</li>
                </ol>
              </div>
              <input
                type="file"
                multiple
                onChange={fileHandle}
                id="photofile"
                style={{ display: "none" }}
              />
              <label htmlFor="photofile">選擇相片</label>
              <div>目前照片數量:{filePhoto.length}</div>
              <button className="bg-blue-300 px-2 py-2 rounded-md">上傳</button>
            </div>
            <button>送出!</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default repairPage;
