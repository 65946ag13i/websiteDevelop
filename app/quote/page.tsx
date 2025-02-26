"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/ImageUpload";

const repairPage: React.FC = () => {
  const session = useSession();

  //子組件上移
  const [photoURL, setPhotoURL] = useState<(string[] | null)[][]>([
    [null, null],
  ]);
  const [photoFile, setphotoFile] = useState<(File[] | null)[][]>([
    [null, null],
  ]);

  //子組件上移
  //----前言開關-----
  const [isOpen, setOpen] = useState(true); //前言
  const toggleAccordion = () => {
    setOpen(!isOpen);
  };
  //----前言開關-----

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
            ▼ 通知 ▼
          </div>

          <div
            className={`overflow-hidden text-start ${isOpen ? "max-h-full" : "max-h-0"}`}
          >
            夏季工作較忙報價通常需7個工作天 <br />
            老闆身兼多職需要看現場估價裝冷氣維修 <br />
            工作繁忙時，無法馬上報價 <br />
            如太久沒報價可能是忘記了請通知老闆
            <br /> 上傳資訊將會保留一年
          </div>
        </div>
        {/* {session ? <div>123</div> : <div>123</div>} */}
        <div>
          <a href="/signin">登入</a>
          <a href="/register">註冊</a>
        </div>

        <div data-mark="報價模塊" className="flex  w-full ">
          <div className="text-center w-1/5 bg-yellow-600">
            <div>新估價</div>
            <div>歷史估價</div>
            <div>修改密碼</div>
            <div>登出</div>
          </div>
          <div className="text-center w-4/5  bg-blue-400">
            {/*報價品牌*/}
            <div>需要報價的品牌</div>

            <div>
              <label>
                <input
                  type="checkbox"
                  value="國際牌"
                  checked={conditionerSelectedOption.includes("國際牌")}
                  onChange={conditionerCheckboxHandle}
                />
                國際牌
              </label>

              <label>
                <input
                  type="checkbox"
                  value="日立"
                  checked={conditionerSelectedOption.includes("日立")}
                  onChange={conditionerCheckboxHandle}
                />
                日立
              </label>
              <label>
                <input
                  type="checkbox"
                  value="華菱"
                  checked={conditionerSelectedOption.includes("華菱")}
                  onChange={conditionerCheckboxHandle}
                />
                華菱
              </label>
            </div>

            <div>其他品牌也可以詢問:</div>
            <input type="textarea" />

            {/*報價品牌*/}
            {/*坪數計算*/}
            <div>輸入房間大小(長x寬、坪數和平方公尺 選一組輸入)</div>
            <div>
              <div>
                <label htmlFor="length">長:</label>
                {/*leading-tight等價CSS line-height:1.25*/}
                <input
                  className="leading-tight"
                  style={{ width: "5rem" }}
                  type="number"
                  id="length"
                  value={length}
                  onChange={saveLength}
                />
                <label htmlFor="width">寬:</label>
                <input
                  className="leading-tight"
                  style={{ width: "5rem" }}
                  type="number"
                  id="width"
                  value={width}
                  onChange={saveWidth}
                />
              </div>
              <div>
                <label htmlFor="squareMeter">平方公尺:</label>
                <input
                  className="leading-tight"
                  style={{ width: "5rem" }}
                  type="number"
                  id="squareMeter"
                  value={squareMeter}
                  onChange={handleSquareMeterChange}
                />
                <label htmlFor="squareMeter">坪數:</label>
                <input
                  className="leading-tight"
                  style={{ width: "5rem" }}
                  type="number"
                  id="ping"
                  value={ping}
                  onChange={handlePingChange}
                />
              </div>
            </div>
            {/*坪數計算*/}

            {/*西曬選擇*/}
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
            {/*西曬選擇*/}

            {/*圖片建議內容*/}

            <div>請盡量提供以下內容圖片，比較好報價</div>
            <div>
              <ol className=" list-none list-inside pl-2">
                <li>內機安裝位置</li>
                <li>外機安裝位置</li>
                <li>電源到外機的位置</li>
                <li>內機、外機排水位置</li>
              </ol>
            </div>
            {/*圖片建議內容*/}
            <ImageUpload
              photoFile={photoFile}
              setphotoFile={setphotoFile}
              photoURL={photoURL}
              setPhotoURL={setPhotoURL}
            />
            <div>
              {" "}
              <input type="textarea" />
            </div>

            <button>送出!</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default repairPage;
